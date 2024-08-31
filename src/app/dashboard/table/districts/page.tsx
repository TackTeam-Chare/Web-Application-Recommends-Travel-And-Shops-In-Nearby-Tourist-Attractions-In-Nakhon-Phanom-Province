"use client"
import React, { useEffect, useState, useMemo, FC } from 'react';
import { useRouter } from 'next/navigation';
import { getDistricts } from '@/services/admin/get';
import { deleteDistrict } from '@/services/admin/delete';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddDistrictModal from '@/components/Dashboard/Modal/Add/AddDistrictModal';
import EditDistrictModal from '@/components/Dashboard/Modal/Edit/EditDistrictModal';

interface District {
  id: string;
  name: string;
}

const DistrictsPage: FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDistricts = async (): Promise<void> => {
      try {
        const result: District[] = await getDistricts();
        setDistricts(result);
      } catch (err) {
        toast.error('Error fetching districts');
      }
    };

    fetchDistricts();
  }, []);

  const handleDelete = async (id: string): Promise<void> => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this district?</p>
          <button
            onClick={async () => {
              try {
                await deleteDistrict(id);
                setDistricts((prevDistricts) => prevDistricts.filter((district) => district.id !== id));
                toast.success('District deleted successfully!');
                closeToast();
              } catch (error) {
                console.error(`Error deleting district with ID ${id}:`, error);
                toast.error('Error deleting district. Please try again.');
              }
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
          >
            Yes
          </button>
          <button
            onClick={closeToast}
            className="bg-gray-600 text-white px-4 py-2 rounded-md ml-2 hover:bg-gray-700 transition duration-300 ease-in-out"
          >
            No
          </button>
        </div>
      ),
      { closeButton: false }
    );
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (district: District) => {
    setSelectedDistrict(district);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDistrict(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Actions',
        Cell: ({ row }: { row: { original: District } }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => openEditModal(row.original)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
            >
              Delete
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
      data: districts,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex } = state;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">Districts</h1>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={openAddModal}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Add New District
          </button>
          <input
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
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
            Previous
          </button>
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
            Next
          </button>
        </div>
        <ToastContainer />

        {/* Add District Modal */}
        {isAddModalOpen && (
          <AddDistrictModal isOpen={isAddModalOpen} onClose={closeAddModal} />
        )}

        {/* Edit District Modal */}
        {isEditModalOpen && selectedDistrict && (
          <EditDistrictModal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            district={selectedDistrict}  // Ensure the district prop is passed correctly
          />
        )}
      </div>
    </div>
  );
};

export default DistrictsPage;
