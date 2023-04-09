import announcements from '../components/Announcements/announcements.json';
import { GoPrimitiveSquare } from 'react-icons/go';

function Home() {
    const renderedAnnoucements = announcements.map((announce) => (
        <div className='flex items-center py-3'>
            <GoPrimitiveSquare className='bg-kedifapgreen-300 text-kedifapgreen-300 mr-4 shadow-top rounded' />
             {announce.title}
        </div>
    ));
    return (
        <div>
            <h1 className="text-2xl py-4">Ανακοινώσεις</h1>
            <div>
                {renderedAnnoucements}
            </div>
        </div>
    );
}

export default Home;