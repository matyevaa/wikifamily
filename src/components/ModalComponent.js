import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react'; //package for transition of popup menu. Reference https://headlessui.dev/react/transition

// ################################################################################
// # Description:  Component for transitions of different popup menus such as providing different family tree options, adding family member/spouse,etc.
// # 
// # input:  a 'show' prop       
// # 
// # return: content to be shown/not shown 
// ################################################################################

{/*show prop controlling if children should be shown or hidden */}
export default function ModalComponent({ show, onClose, children }) {
  return (
    <Transition.Root show={show} as={Fragment}> 
      <Dialog
        as='div'
        className='fixed z-10 inset-0 overflow-y-auto'
        onClose={onClose}
      >
        <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300' //Applied the entire time an element is entering. Usually you define your duration and what properties you want to transition here
            enterFrom='opacity-0' //The starting point to enter from
            enterTo='opacity-100' // The ending point to enter to
            leave='ease-in duration-200' //Applied the entire time an element is leaving. Usually you define your duration and what properties you want to transition here
            leaveFrom='opacity-100' //The starting point to leave from
            leaveTo='opacity-0' //The ending point to leave to
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300' //same as above
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6'>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
