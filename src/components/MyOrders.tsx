import React, { useState } from 'react';
import { ArrowLeft, Truck, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
}

interface MyOrdersProps {
  onBack: () => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ onBack }) => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');

  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299,
      items: [
        {
          id: '1',
          name: 'Premium Wireless Headphones',
          image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
          quantity: 1,
          price: 199,
          color: 'Black'
        },
        {
          id: '2',
          name: 'Smart Watch Pro',
          image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
          quantity: 1,
          price: 100,
          color: 'Silver'
        }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 199,
      items: [
        {
          id: '3',
          name: 'Designer Handbag',
          image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300',
          quantity: 1,
          price: 199,
          color: 'Brown'
        }
      ]
    },
    {
      id: 'ORD-003',
      date: '2024-01-22',
      status: 'processing',
      total: 199,
      items: [
        {
          id: '4',
          name: 'Luxury Perfume',
          image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=300',
          quantity: 1,
          price: 199
        }
      ]
    }
  ]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'To Pay' },
    { id: 'shipped', label: 'To Ship' },
    { id: 'delivered', label: 'Delivered' }
  ];

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => {
        if (activeTab === 'pending') return order.status === 'pending' || order.status === 'processing';
        if (activeTab === 'shipped') return order.status === 'shipped';
        if (activeTab === 'delivered') return order.status === 'delivered';
        return true;
      });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'In Transit';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending Payment';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={onBack}
              className="flex items-center text-gray-900 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-gray-900">My Orders</h1>
            <div className="w-5"></div>
          </div>
        </div>

        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 pb-20">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center mt-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">No orders yet</h3>
            <p className="text-sm text-gray-500">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-xs text-gray-300">|</span>
                      <span className="text-xs text-gray-900 font-medium">
                        Order {order.id}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${
                      order.status === 'delivered' ? 'text-green-600' :
                      order.status === 'shipped' ? 'text-blue-600' :
                      order.status === 'processing' ? 'text-orange-600' :
                      'text-gray-600'
                    }`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={item.id}>
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                              {item.name}
                            </h4>
                            {(item.color || item.size) && (
                              <p className="text-xs text-gray-500 mb-1">
                                {item.color && `Color: ${item.color}`}
                                {item.color && item.size && ' | '}
                                {item.size && `Size: ${item.size}`}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {item.price} MRU
                              </span>
                            </div>
                          </div>
                        </div>
                        {idx < order.items.length - 1 && (
                          <div className="border-t border-gray-100 mt-3"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </span>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 mr-2">Total:</span>
                        <span className="text-base font-bold text-gray-900">
                          {order.total} MRU
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {order.status === 'shipped' && (
                        <button className="flex-1 bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                          <Truck className="w-4 h-4" />
                          Track Order
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <>
                          <button className="flex-1 bg-gray-100 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            Buy Again
                          </button>
                          <button className="flex-1 bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                            Review
                          </button>
                        </>
                      )}
                      {(order.status === 'processing' || order.status === 'pending') && (
                        <>
                          <button className="flex-1 bg-gray-100 text-gray-900 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            Cancel
                          </button>
                          <button className="flex-1 bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Contact
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;