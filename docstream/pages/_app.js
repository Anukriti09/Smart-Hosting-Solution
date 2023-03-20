import "tailwindcss/tailwind.css";
import "@material-tailwind/react/tailwind.css";
import 'react-quill/dist/quill.snow.css';
import "./editor_style.css"
import Head from "next/head";
import $ from 'jquery';
import '../styles/main.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Font Awesome Link */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
          integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w=="
          crossOrigin="anonymous"
        />
        {/* Material Icons Link */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js">
        </script> */}
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js">
        </script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.js">
        </script>

       
      
      </Head>
      <Component {...pageProps} />

      
    </>
  );
}

export default MyApp;
