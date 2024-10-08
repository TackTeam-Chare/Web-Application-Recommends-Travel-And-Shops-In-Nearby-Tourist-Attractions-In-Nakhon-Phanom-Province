'use client';

import React, { useEffect, useState, useMemo, FC } from 'react';
import { useRouter } from 'next/navigation';
import { getSeasons } from '@/services/admin/get';
import { deleteSeason } from '@/services/admin/delete';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSeasonForm from '@/components/Dashboard/Modal/Add/AddSeasonModal';
import EditSeasonModal from '@/components/Dashboard/Modal/Edit/EditSeasonModal';

interface Season {
  id: string;
  name: string;
  date_start: string;
  date_end: string;
}

const SeasonsPage: FC = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSeasons = async (): Promise<void> => {
      try {
        const result: Season[] = await getSeasons();
        setSeasons(result);
      } catch (err) {
        toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลฤดูกาล');
      }
    };

    fetchSeasons();
  }, []);

  const handleDelete = async (id: string): Promise<void> => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบฤดูกาลนี้?</p>
          <button
            onClick={async () => {
              try {
                await deleteSeason(id);
                setSeasons((prevSeasons) => prevSeasons.filter((season) => season.id !== id));
                toast.success('ลบฤดูกาลสำเร็จ!');
                closeToast();
              } catch (error) {
                console.error(`เกิดข้อผิดพลาดในการลบฤดูกาล ID ${id}:`, error);
                toast.error('เกิดข้อผิดพลาดในการลบฤดูกาล กรุณาลองใหม่อีกครั้ง');
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
  };

  const handleEdit = (id: string) => {
    setSelectedSeasonId(id);
    setIsEditModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'ชื่อฤดูกาล',
        accessor: 'name',
      },
      {
        Header: 'วันที่เริ่มต้น',
        accessor: 'date_start',
      },
      {
        Header: 'วันที่สิ้นสุด',
        accessor: 'date_end',
      },
      {
        Header: 'การกระทำ',
        Cell: ({ row }: { row: { original: Season } }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              แก้ไข
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
            >
              ลบ
            </button>
          </div>
        ),
      },
    ],
    []
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
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: seasons,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">จัดการฤดูกาล</h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            เพิ่มฤดูกาลใหม่
          </button>
          <input
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="ค้นหา..."
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={column.id}
                      className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider"
                    >
                      {column.render('Header')}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
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
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
            ก่อนหน้า
          </button>
          <span>
            หน้า{' '}
            <strong>
              {pageIndex + 1} จาก {pageOptions.length}
            </strong>
          </span>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
            ถัดไป
          </button>
        </div>
        <ToastContainer />
      </div>

      {/* Modals */}
      <AddSeasonForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {selectedSeasonId && (
        <EditSeasonModal id={selectedSeasonId} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      )}
    </div>
  );
};

export default SeasonsPage;
