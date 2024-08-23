"use client";

import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-orange-500 text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-4xl font-bold">นครพนม</div>
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-lg hover:text-gray-200">
            หน้าเเรก
          </a>
          <a href="/search" className="text-lg hover:text-gray-200">
            ค้นหาสถานที่
          </a>
          <a href="/2" className="text-lg hover:text-gray-200">
            เเผนที่
          </a>
          <a href="/place/currently-open-places" className="text-lg hover:text-gray-200">
            สถานที่ที่เปิดตอนนี้
          </a>
          <Popover className="relative">
            <PopoverButton className="text-lg hover:text-gray-200 flex items-center">
              สถานที่
              <ChevronDownIcon className="ml-1 h-5 w-5" />
            </PopoverButton>
            <PopoverPanel className="absolute left-0 z-10 mt-2 w-48 rounded-lg bg-white text-gray-700 shadow-lg">
              <div className="py-2">
                <a href="/place" className="block px-4 py-2 hover:bg-gray-100">
                  สถานที่ทั้งหมด
                </a>
                <a
                  href="/place/tourist-attractions"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  สถานที่ท่องเที่ยว
                </a>
                <a
                  href="/place/accommodations"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  ที่พัก
                </a>
                <a
                  href="/place/restaurants"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  ร้านอาหาร
                </a>
                <a
                  href="/place/souvenir-shops"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  ร้านค้าของฝาก
                </a>
              </div>
            </PopoverPanel>
          </Popover>
        </nav>
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="text-white hover:text-gray-200"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden z-50"
      >
        <div className="fixed inset-0 z-10 bg-black bg-opacity-30" />
        <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full max-w-sm overflow-y-auto bg-orange-500 text-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="text-4xl font-bold">
              นครพนม
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <a
              href="/"
              className="block text-lg text-white hover:bg-orange-600 rounded-md px-4 py-2"
            >
              หน้าเเรก
            </a>
            <a
              href="/search"
              className="block text-lg text-white hover:bg-orange-600 rounded-md px-4 py-2"
            >
              ค้นหาสถานที่
            </a>
            <a
              href="/2"
              className="block text-lg text-white hover:bg-orange-600 rounded-md px-4 py-2"
            >
              เเผนที่
            </a>
            <a
              href="/place/currently-open-places"
              className="block text-lg text-white hover:bg-orange-600 rounded-md px-4 py-2"
            >
              สถานที่ที่เปิดตอนนี้
            </a>
            <Disclosure as="div">
              <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 px-4 text-lg hover:bg-orange-600">
                สถานที่
                <ChevronDownIcon className="h-5 w-5 group-data-[open]:rotate-180" />
              </DisclosureButton>
              <DisclosurePanel className="mt-2 space-y-2">
                <a
                  href="/place"
                  className="block rounded-lg py-2 px-4 text-lg hover:bg-orange-600"
                >
                  สถานที่ทั้งหมด
                </a>
                <a
                  href="/place/tourist-attractions"
                  className="block rounded-lg py-2 px-4 text-lg hover:bg-orange-600"
                >
                  สถานที่ท่องเที่ยว
                </a>
                <a
                  href="/place/accommodations"
                  className="block rounded-lg py-2 px-4 text-lg hover:bg-orange-600"
                >
                  ที่พัก
                </a>
                <a
                  href="/place/restaurants"
                  className="block rounded-lg py-2 px-4 text-lg hover:bg-orange-600"
                >
                  ร้านอาหาร
                </a>
                <a
                  href="/place/souvenir-shops"
                  className="block rounded-lg py-2 px-4 text-lg hover:bg-orange-600"
                >
                  ร้านค้าของฝาก
                </a>
              </DisclosurePanel>
            </Disclosure>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
