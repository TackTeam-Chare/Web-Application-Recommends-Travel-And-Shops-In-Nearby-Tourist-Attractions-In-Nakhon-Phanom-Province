'use client';

import React, { useEffect, useState, FC } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createSeasonsRelation } from '@/services/admin/insert';
import { getSeasons, getPlaces } from '@/services/admin/get';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosError } from 'axios';

interface FormData {
  tourism_entities_id: number; 
  season_id: number; 
}

interface Season {
  id: number; 
  name: string;
}

interface Place {
  id: number; 
  name: string;
}

const AddSeasonsRelationForm: FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [touristEntities, setTouristEntities] = useState<Place[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [seasonsData, touristEntitiesData] = await Promise.all([
          getSeasons(),
          getPlaces()
        ]);
        setSeasons(seasonsData);
        setTouristEntities(touristEntitiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    };

    fetchData();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await createSeasonsRelation(data);
      toast.success(`ความสัมพันธ์ถูกสร้างสำเร็จด้วย ID: ${response.id}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      if ((error as AxiosError).response && (error as AxiosError).response?.status === 400) {
        toast.error('เกิดข้อผิดพลาดในการสร้างความสัมพันธ์', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error('Error creating relation:', error);
        toast.error('เกิดข้อผิดพลาดในการสร้างความสัมพันธ์', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 p-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md overflow-hidden">
        <h2 className="text-2xl font-bold mb-5 text-center text-indigo-600">เพิ่มความสัมพันธ์ระหว่างฤดูกาลและสถานที่ท่องเที่ยว</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative z-0 w-full mb-6 group">
            <label htmlFor="tourism_entities_id" className="block text-sm font-medium text-gray-700">สถานที่ท่องเที่ยว</label>
            <select
              id="tourism_entities_id"
              {...register('tourism_entities_id', { required: 'กรุณาเลือกสถานที่ท่องเที่ยว', valueAsNumber: true })}
              className="block mt-1 w-full py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">เลือกสถานที่ท่องเที่ยว</option>
              {touristEntities.map(entity => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </select>
            {errors.tourism_entities_id && <p className="text-red-500 text-xs mt-1">{errors.tourism_entities_id.message}</p>}
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <label htmlFor="season_id" className="block text-sm font-medium text-gray-700">ฤดูกาล</label>
            <select
              id="season_id"
              {...register('season_id', { required: 'กรุณาเลือกฤดูกาล', valueAsNumber: true })}
              className="block mt-1 w-full py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">เลือกฤดูกาล</option>
              {seasons.map(season => (
                <option key={season.id} value={season.id}>
                  {season.name} (ID: {season.id})
                </option>
              ))}
            </select>
            {errors.season_id && <p className="text-red-500 text-xs mt-1">{errors.season_id.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            เพิ่มความสัมพันธ์
          </button>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
};

export default AddSeasonsRelationForm;
