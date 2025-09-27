import Swal from 'sweetalert2';
import LoaderSplash from './LoaderSplash';

export const Popup = (type, title, description, timer) => {
    switch (type) {
        case 'success':
            Swal.fire({
                title: title || 'Success!',
                html: description,
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/7518/7518748.png',
                imageHeight: 100,
                timer: timer || 3000,
                timerProgressBar: true,
                width: 400,
            });
            break;

        case 'error':
            Swal.fire({
                title: title || 'Error!',
                html: description || 'Something went wrong. Please try again.',
                imageUrl: 'https://cdn-icons-png.flaticon.com/512/2581/2581801.png',
                imageHeight: 100,
                timer: timer || 5000,
                timerProgressBar: true,
                width: 400,
            });
            break;

        default:
            return <LoaderSplash show={false} />;
    }
};
