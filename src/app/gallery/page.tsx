'use client';

import React from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function GalleryPage() {
  const images = [
    { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80', caption: 'The Courtyard at Dusk', span: 'col-span-2 row-span-2' },
    { url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', caption: 'Slow-Cooked Dal Makhani', span: 'col-span-1' },
    { url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80', caption: 'Charcoal Tandoori Murgh Tikka', span: 'col-span-1' },
    { url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', caption: 'Gosht Dum Biryani', span: 'col-span-1' },
    { url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', caption: 'Kesariya Malai Ghevar', span: 'col-span-1' },
    { url: 'https://images.unsplash.com/photo-1567184109411-b28f2703e1e2?auto=format&fit=crop&w=600&q=80', caption: 'Paneer Tikka Platter', span: 'col-span-1' },
    { url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', caption: 'Spiced Mint Chaas', span: 'col-span-1' },
    { url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80', caption: 'Rajasthani Laal Maas', span: 'col-span-2' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            Restaurant Gallery
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Dining spaces, kitchen preparations, and dishes from The Copper Table in Jaipur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[220px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative rounded-lg overflow-hidden border border-gray-200 shadow-2xs group ${
                img.span || ''
              }`}
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs text-white font-medium">
                  {img.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
