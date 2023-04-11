import { GoSearch } from 'react-icons/go';

export const GlobalFilter = ({filter, setFilter}) => {
    return (
        <div className='relative'>
            <GoSearch className='absolute inset-2 text-gray-500' />
            <input className="bg-gray-200 rounded-2xl shadow-lg p-1 pl-8" value={filter || ''} onChange={(e) => setFilter(e.target.value)} />
        </div>
    )
}