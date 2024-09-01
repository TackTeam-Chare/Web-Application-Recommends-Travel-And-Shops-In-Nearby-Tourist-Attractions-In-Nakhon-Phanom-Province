"use client";

import React, { useEffect, useState, useMemo, FC, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPlaces } from "@/services/admin/get";
import { deletePlace } from "@/services/admin/delete";
import { useTable, useSortBy, usePagination, useGlobalFilter, Column, HeaderGroup, Row, TableInstance } from "react-table";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddPlacesModal from "@/components/Dashboard/Modal/Add/AddPlacesModal"; 
import EditPlaceModal from "@/components/Dashboard/Modal/Edit/EditPlaceModal";

// Dynamically import FontAwesomeIcon to prevent SSR mismatch
const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then(mod => mod.FontAwesomeIcon), { ssr: false });

import { faPlus, faEdit, faTrash, faSearch, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface Place {
  id: number;
  image_url: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
}

// Extend TableInstance interface to support pagination and global filter
interface TableInstanceWithPagination<T extends object> extends TableInstance<T> {
  page: Row<T>[];
  nextPage: () => void;
  previousPage: () => void;
  canNextPage: boolean;
  canPreviousPage: boolean;
  pageOptions: number[];
  setGlobalFilter: (filterValue: any) => void;
  state: {
    pageIndex: number;
    globalFilter: string;
  };
}

const PlaceIndexPage: FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editPlaceId, setEditPlaceId] = useState<string | null>(null); // Store the ID to edit
  const router = useRouter();

  useEffect(() => {
    const fetchPlaces = async (): Promise<void> => {
      try {
        const result: Place[] = await getPlaces();
        setPlaces(result);
      } catch (err) {
        toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลสถานที่');
      }
    };

    fetchPlaces();
  }, []);

  // Use useCallback to prevent recreation of handleDelete on every render
  const handleDelete = useCallback(async (id: number): Promise<void> => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>คุณแน่ใจหรือว่าต้องการลบสถานที่นี้?</p>
          <button
            onClick={async () => {
              try {
                await deletePlace(id);
                setPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== id));
                toast.success('ลบสถานที่สำเร็จ!');
                closeToast();
              } catch (error) {
                console.error(`Error deleting place with ID ${id}:`, error);
                toast.error('เกิดข้อผิดพลาดในการลบสถานที่ กรุณาลองใหม่อีกครั้ง');
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
          >
            ใช่
          </button>
          <button
            onClick={closeToast}
            className="bg-gray-600 text-white px-4 py-2 rounded-md ml-2 hover:bg-gray-700 transition duration-300 ease-in-out"
          >
            ไม่
          </button>
        </div>
      ),
      { closeButton: false }
    );
  }, []);

  const columns: Column<Place>[] = useMemo(
    () => [
      {
        Header: 'รูปภาพ',
        accessor: 'image_url',
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          value ? <Image src={value} alt="Place" width={50} height={50} className="object-cover rounded" /> : 'ไม่มีรูปภาพ'
        ),
      },
      {
        Header: 'ชื่อ',
        accessor: 'name',
      },
      {
        Header: 'คำอธิบาย',
        accessor: 'description',
      },
      {
        Header: 'ที่ตั้ง',
        accessor: 'location',
      },
      {
        Header: 'ละติจูด',
        accessor: 'latitude',
      },
      {
        Header: 'ลองจิจูด',
        accessor: 'longitude',
      },
      {
        Header: 'การดำเนินการ',
        Cell: ({ row }: { row: Row<Place> }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setEditPlaceId(row.original.id.toString());
                setIsEditModalOpen(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              แก้ไข
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out flex items-center"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              ลบ
            </button>
          </div>
        ),
      },
    ],
    [router, handleDelete]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    state: { pageIndex, globalFilter },
    setGlobalFilter,
  } = useTable<Place>(
    {
      columns,
      data: places,
      initialState: { pageIndex: 0 }, // Proper initial state setup for pagination
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as TableInstanceWithPagination<Place>; // Use extended type to support pagination and global filter

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">สถานที่ท่องเที่ยว</h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            เพิ่มสถานที่ใหม่
          </button>
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
            <input
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="ค้นหา..."
              className="p-2 pl-10 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              {headerGroups.map((headerGroup: HeaderGroup<Place>) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps((column as any).getSortByToggleProps())}
                      key={column.id}
                      className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider"
                    >
                      {column.render('Header')}
                      <span>
                        {(column as any).isSorted ? ((column as any).isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-100 transition duration-300 ease-in-out">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} key={cell.column.id} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            ก่อนหน้า
          </button>
          <span>
            หน้า{' '}
            <strong>
              {pageIndex + 1} จาก {pageOptions.length}
            </strong>
          </span>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 flex items-center">
            ถัดไป
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>
        <ToastContainer />
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <AddPlacesModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editPlaceId && (
        <EditPlaceModal id={editPlaceId} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
};

export default PlaceIndexPage;
