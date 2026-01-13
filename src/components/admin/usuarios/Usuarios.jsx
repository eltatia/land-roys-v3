import React, { useState, useEffect } from 'react';
import { supabase } from '../../../services/Supabase';
import { createClient } from '@supabase/supabase-js';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import Swal from 'sweetalert2';

// Cliente temporal para crear usuarios sin cerrar sesión del admin
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const tempSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID del usuario en edición
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'usuario',
    active: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (user) => {
    setEditingId(user.id);

    // Intentar separar nombre y apellido del username
    const nameParts = (user.username || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setFormData({
      firstName: firstName,
      lastName: lastName,
      email: user.email || '',
      phone: '', // No tenemos el teléfono en profiles por defecto
      password: '', // No mostramos contraseña
      confirmPassword: '',
      role: user.role || 'usuario',
      active: true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará el perfil del usuario. (Nota: El usuario de Auth permanecerá pero sin acceso)",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const { error, count } = await supabase
          .from('profiles')
          .delete({ count: 'exact' })
          .eq('id', id);

        if (error) throw error;

        if (count === 0) {
          Swal.fire('Error', 'No se pudo eliminar. Verifica permisos o si el usuario existe.', 'error');
          return;
        }

        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire('Error', 'No se pudo eliminar el usuario: ' + error.message, 'error');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'usuario',
      active: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseñas solo si se están ingresando (obligatorio al crear, opcional al editar)
    if (!editingId && formData.password !== formData.confirmPassword) {
      return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
    }
    if (editingId && formData.password && formData.password !== formData.confirmPassword) {
      return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
    }

    try {
      Swal.fire({
        title: editingId ? 'Actualizando...' : 'Creando usuario...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      if (editingId) {
        // --- MODO EDICIÓN ---

        const updates = {
          username: `${formData.firstName} ${formData.lastName}`.trim(),
          role: formData.role,
        };

        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', editingId);

        if (error) throw error;

        Swal.fire('Éxito', 'Usuario actualizado correctamente', 'success');

      } else {
        // --- MODO CREACIÓN ---

        // 1. Crear usuario en Auth
        const { data: authData, error: authError } = await tempSupabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // 2. Crear/Upsert perfil
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              username: `${formData.firstName} ${formData.lastName}`.trim(),
              email: formData.email,
              role: formData.role,
            });

          if (profileError) throw profileError;
          Swal.fire('Éxito', 'Usuario creado correctamente', 'success');
        }
      }

      closeModal();
      fetchUsers();

    } catch (error) {
      console.error('Error saving user:', error);
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <MdAdd size={20} />
          Crear Usuario
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Usuario</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Rol</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Fecha Registro</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                          {user.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-gray-700">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                          ? 'bg-purple-100 text-purple-600'
                          : user.role === 'assistant'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                        {user.role === 'admin' ? 'Administrador' : user.role === 'assistant' ? 'Asistente' : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear/Editar Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Editar Usuario' : 'Crear Usuario'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Datos del Usuario */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Datos del Usuario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      placeholder="Juan"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      placeholder="Pérez"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      placeholder="juan.perez@landroys.com"
                      required
                      disabled={!!editingId} // No permitir editar email por ahora
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      placeholder="Teléfono"
                      disabled={!!editingId} // Deshabilitado en edición porque no lo recuperamos
                    />
                  </div>
                </div>
              </div>

              {/* Contraseña (Opcional en edición) */}
              {!editingId && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Contraseña</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        placeholder="Contraseña"
                        required={!editingId}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        placeholder="Confirmar Contraseña"
                        required={!editingId}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Roles y Permisos */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Roles y Permisos</h3>
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asignar Rol</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    >
                      <option value="usuario">Usuario</option>
                      <option value="admin">Administrador</option>
                      <option value="assistant">Asistente</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label className="text-sm text-gray-700">Usuario Activo</label>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium shadow-sm shadow-orange-200"
                >
                  {editingId ? 'Actualizar Usuario' : 'Guardar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;