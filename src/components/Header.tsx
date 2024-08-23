"use client";

import { useState } from "react";
import { Dialog, Disclosure, Popover } from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MapIcon,
  ClockIcon,
  SunIcon,
  StarIcon,
  BuildingOfficeIcon,
  GiftIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/20/solid";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-orange-500 text-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-4xl font-bold">นครพนม</div>
        <nav className="hidden md:flex space-x-6">
          <a
            href="/"
            className="flex items-center text-lg hover:text-white hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2"
          >
            <HomeIcon className="h-5 w-5 mr-1" />
            หน้าเเรก
          </a>
          <a
            href="/search"
            className="flex items-center text-lg hover:text-white hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
            ค้นหาสถานที่
          </a>
          <a
            href="/2"
            className="flex items-center text-lg hover:text-white hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2"
          >
            <MapIcon className="h-5 w-5 mr-1" />
            เเผนที่
          </a>
          <Popover className="relative">
            <Popover.Button className="flex items-center text-lg hover:text-white hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg px-3 py-2">
              สถานที่
              <ChevronDownIcon className="ml-1 h-5 w-5" />
            </Popover.Button>
            <Popover.Panel className="absolute left-0 z-10 mt-2 w-56 rounded-lg bg-white text-gray-700 shadow-lg">
              <div className="py-2">
                {[
                  {
                    href: "/place/currently-open-places",
                    icon: ClockIcon,
                    text: "เปิดในขณะนี้",
                  },
                  {
                    href: "/place/season-real-time",
                    icon: SunIcon,
                    text: "ฤดูกาลนี้",
                  },
                  {
                    href: "/place/top-rated-tourist-entities",
                    icon: StarIcon,
                    text: "ติดอันดับ",
                  },
                  {
                    href: "/place",
                    icon: BuildingOfficeIcon,
                    text: "สถานที่ทั้งหมด",
                  },
                  {
                    href: "/place/tourist-attractions",
                    icon: SunIcon,
                    text: "สถานที่ท่องเที่ยว",
                  },
                  {
                    href: "/place/accommodations",
                    icon: BuildingStorefrontIcon,
                    text: "ที่พัก",
                  },
                  {
                    href: "/place/restaurants",
                    icon: GiftIcon,
                    text: "ร้านอาหาร",
                  },
                  {
                    href: "/place/souvenir-shops",
                    icon: ShoppingBagIcon,
                    text: "ร้านค้าของฝาก",
                  },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center block px-4 py-2 hover:bg-gray-100 transition duration-300 ease-in-out"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.text}
                  </a>
                ))}
              </div>
            </Popover.Panel>
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
        onClose={() => setMobileMenuOpen(false)}
        className="lg:hidden z-50"
      >
        <div className="fixed inset-0 z-10 bg-black bg-opacity-30" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-20 w-full max-w-sm overflow-y-auto bg-orange-500 text-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
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
            {[
              { href: "/", icon: HomeIcon, text: "หน้าเเรก" },
              { href: "/search", icon: MagnifyingGlassIcon, text: "ค้นหาสถานที่" },
              { href: "/2", icon: MapIcon, text: "เเผนที่" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center block text-lg text-white hover:bg-orange-600 rounded-md px-4 py-2 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.text}
              </a>
            ))}
            <Disclosure as="div">
              <Disclosure.Button className="group flex w-full items-center justify-between rounded-lg py-2 px-4 text-lg hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105">
                สถานที่
                <ChevronDownIcon className="h-5 w-5 group-data-[open]:rotate-180 transition duration-300 ease-in-out" />
              </Disclosure.Button>
              <Disclosure.Panel className="mt-2 space-y-2">
                {[
                  {
                    href: "/place/currently-open-places",
                    icon: ClockIcon,
                    text: "เปิดในขณะนี้",
                  },
                  {
                    href: "/place/season-real-time",
                    icon: SunIcon,
                    text: "ฤดูกาลนี้",
                  },
                  {
                    href: "/place/top-rated-tourist-entities",
                    icon: StarIcon,
                    text: "ติดอันดับ",
                  },
                  {
                    href: "/place",
                    icon: BuildingOfficeIcon,
                    text: "สถานที่ทั้งหมด",
                  },
                  {
                    href: "/place/tourist-attractions",
                    icon: SunIcon,
                    text: "สถานที่ท่องเที่ยว",
                  },
                  {
                    href: "/place/accommodations",
                    icon: BuildingStorefrontIcon,
                    text: "ที่พัก",
                  },
                  {
                    href: "/place/restaurants",
                    icon: GiftIcon,
                    text: "ร้านอาหาร",
                  },
                  {
                    href: "/place/souvenir-shops",
                    icon: ShoppingBagIcon,
                    text: "ร้านค้าของฝาก",
                  },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center block rounded-lg py-2 px-4 hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.text}
                  </a>
                ))}
              </Disclosure.Panel>
            </Disclosure>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
