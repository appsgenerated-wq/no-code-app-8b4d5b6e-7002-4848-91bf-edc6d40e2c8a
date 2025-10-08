import React, { useEffect, useState } from 'react';
import config from '../constants.js';
import { ArrowRightOnRectangleIcon, UserCircleIcon, BuildingStorefrontIcon, TruckIcon, ShoppingCartIcon, PlusIcon, PhotoIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// A simple ImageUploader component logic embedded for clarity
const ImageUploader = ({ onFileSelect, previewUrl }) => (
  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
    <div className="text-center">
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-md" />
      ) : (
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
      )}
      <div className="mt-4 flex text-sm leading-6 text-gray-600">
        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
          <span>Upload a file</span>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileSelect} />
        </label>
        <p className="pl-1">or drag and drop</p>
      </div>
      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
    </div>
  </div>
);


const DashboardPage = ({ user, onLogout, manifest }) => {

  const renderDashboard = () => {
    switch (user.role) {
      case 'customer':
        return <CustomerDashboard manifest={manifest} user={user} />;
      case 'driver':
        return <DriverDashboard manifest={manifest} user={user} />;
      case 'restaurant_owner':
        return <OwnerDashboard manifest={manifest} user={user} />;
      default:
        return <p>Invalid user role.</p>;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <UserCircleIcon className="h-8 w-8 text-gray-500"/>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Welcome, {user.name}!</h1>
              <p className="text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-blue-600">Admin Panel</a>
            <button onClick={onLogout} className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-red-600 p-2 rounded-md hover:bg-red-50">
              <span>Logout</span>
              <ArrowRightOnRectangleIcon className="h-5 w-5"/>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

// --- Role-based Dashboards ---

const CustomerDashboard = ({ manifest, user }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    manifest.from('Restaurant').find().then(res => setRestaurants(res.data || []));
  }, [manifest]);

  const viewMenu = (restaurant) => {
    setSelectedRestaurant(restaurant);
    manifest.from('MenuItem').find({ filter: { restaurantId: restaurant.id } }).then(res => setMenuItems(res.data || []));
  }

  const placeOrder = async (menuItem) => {
    try {
        await manifest.from('Order').create({
            deliveryAddress: '123 Main St, Anytown, USA', // Dummy address
            totalPrice: menuItem.price,
            customerId: user.id,
            restaurantId: selectedRestaurant.id
        });
        alert('Order placed successfully!');
    } catch(err) {
        alert('Failed to place order: ' + err.message);
    }
  }

  return (
    <div>
      {!selectedRestaurant ? (
        <>
          <h2 className="text-2xl font-bold mb-4 flex items-center"><BuildingStorefrontIcon className="h-6 w-6 mr-2"/> Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.length > 0 ? restaurants.map(r => (
              <div key={r.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img src={r.logo?.url || 'https://placehold.co/600x400'} alt={r.name} className="h-40 w-full object-cover"/>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{r.name}</h3>
                  <p className="text-sm text-gray-600">{r.cuisine}</p>
                  <button onClick={() => viewMenu(r)} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">View Menu</button>
                </div>
              </div>
            )) : <p>No restaurants found.</p>}
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedRestaurant(null)} className="mb-4 text-blue-600 font-semibold">← Back to Restaurants</button>
          <h2 className="text-2xl font-bold mb-4">Menu for {selectedRestaurant.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.length > 0 ? menuItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                <img src={item.photo?.url || 'https://placehold.co/400x300'} alt={item.name} className="h-32 w-full object-cover rounded-md mb-2"/>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500 flex-grow">{item.description}</p>
                <p className="font-semibold text-green-600 my-2">${item.price.toFixed(2)}</p>
                <button onClick={() => placeOrder(item)} className="mt-auto w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm">Order Now</button>
              </div>
            )) : <p>No menu items for this restaurant.</p>}
          </div>
        </>
      )}
    </div>
  );
}

const DriverDashboard = ({ manifest, user }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    // Fetching orders that need a driver or are in progress by this driver
    manifest.from('Order').with(['customer', 'restaurant']).find().then(res => {
      const availableOrders = res.data.filter(o => o.status === 'Accepted' || (o.driverId === user.id && o.status === 'Out for Delivery'));
      setOrders(availableOrders || []);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, [manifest, user.id]);

  const updateStatus = async (order, newStatus) => {
    const payload = { status: newStatus };
    if (newStatus === 'Out for Delivery') {
        payload.driverId = user.id;
    }
    await manifest.from('Order').update(order.id, payload);
    fetchOrders();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center"><TruckIcon className="h-6 w-6 mr-2"/> Available Deliveries</h2>
      <div className="space-y-4">
        {orders.length > 0 ? orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p><strong>Order #{order.id}</strong> from <strong>{order.restaurant?.name}</strong></p>
              <p className="text-sm text-gray-600">To: {order.deliveryAddress}</p>
            </div>
            <div>
              {order.status === 'Accepted' && <button onClick={() => updateStatus(order, 'Out for Delivery')} className="bg-blue-600 text-white px-4 py-2 rounded-md">Pick Up</button>}
              {order.status === 'Out for Delivery' && <button onClick={() => updateStatus(order, 'Delivered')} className="bg-green-600 text-white px-4 py-2 rounded-md">Mark as Delivered</button>}
            </div>
          </div>
        )) : <p>No available deliveries right now.</p>}
      </div>
    </div>
  );
}

const OwnerDashboard = ({ manifest, user }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', photo: null });
  const [preview, setPreview] = useState(null);

  const fetchRestaurantData = () => {
    manifest.from('Restaurant').find({ filter: { ownerId: user.id } }).then(res => {
      if (res.data && res.data.length > 0) {
        const myRestaurant = res.data[0];
        setRestaurant(myRestaurant);
        fetchMenuItems(myRestaurant.id);
        fetchOrders(myRestaurant.id);
      }
    });
  }

  const fetchMenuItems = (restaurantId) => {
    manifest.from('MenuItem').find({ filter: { restaurantId } }).then(res => setMenuItems(res.data || []));
  };

  const fetchOrders = (restaurantId) => {
    manifest.from('Order').with(['customer']).find({ filter: { restaurantId } }).then(res => setOrders(res.data || []));
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [manifest, user.id]);
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileToken = await manifest.files.upload(file);
      setNewItem({ ...newItem, photo: fileToken });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...newItem,
      price: parseFloat(newItem.price),
      restaurantId: restaurant.id,
    };
    if (editingItem) {
      await manifest.from('MenuItem').update(editingItem.id, payload);
    } else {
      await manifest.from('MenuItem').create(payload);
    }
    closeForm();
    fetchMenuItems(restaurant.id);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setNewItem({ name: item.name, description: item.description, price: item.price, photo: null });
    setPreview(item.photo?.url || null);
    setIsMenuFormOpen(true);
  };

  const deleteMenuItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        await manifest.from('MenuItem').delete(id);
        fetchMenuItems(restaurant.id);
    }
  }

  const closeForm = () => {
    setIsMenuFormOpen(false);
    setEditingItem(null);
    setNewItem({ name: '', description: '', price: '', photo: null });
    setPreview(null);
  };
  
  const updateOrderStatus = async (order, status) => {
    await manifest.from('Order').update(order.id, { status });
    fetchOrders(restaurant.id);
  }

  if (!restaurant) return <p>Loading restaurant data...</p>;

  return (
    <div>
      {isMenuFormOpen ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} Menu Item</h2>
          <form onSubmit={handleMenuSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Photo</label>
                <ImageUploader onFileSelect={handleFileChange} previewUrl={preview} />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={closeForm} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Save Item</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center"><BuildingStorefrontIcon className="h-6 w-6 mr-2"/> My Menu</h2>
                <button onClick={() => setIsMenuFormOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"><PlusIcon className="h-5 w-5 mr-1"/> Add Item</button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {menuItems.length > 0 ? menuItems.map(item => (
                        <li key={item.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <img className="h-12 w-12 rounded-md object-cover" src={item.photo?.url || 'https://placehold.co/100'} alt={item.name}/>
                                <div className="ml-4">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => openEditForm(item)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon className="h-5 w-5"/></button>
                                <button onClick={() => deleteMenuItem(item.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                            </div>
                        </li>
                    )) : <p className="p-4 text-gray-500">No menu items yet.</p>}
                </ul>
            </div>
          </div>

          <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center"><ShoppingCartIcon className="h-6 w-6 mr-2"/> Incoming Orders</h2>
               <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {orders.length > 0 ? orders.map(order => (
                        <li key={order.id} className="p-4">
                           <div className="flex justify-between items-center">
                             <div>
                               <p className="font-semibold">Order #{order.id} for {order.customer?.name}</p>
                               <p className="text-sm text-gray-500">Status: <span className="font-medium text-blue-700">{order.status}</span></p>
                             </div>
                             {order.status === 'Pending' && <button onClick={() => updateOrderStatus(order, 'Accepted')} className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Accept</button>}
                           </div>
                        </li>
                    )) : <p className="p-4 text-gray-500">No incoming orders.</p>}
                </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
