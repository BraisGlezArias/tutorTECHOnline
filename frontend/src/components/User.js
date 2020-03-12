import React, {useState} from "react";
import { UploadProfilePhoto } from "../components/UploadProfilePhoto";
import { ChangePassword } from '../components/ChangePassword';
import "../css/myaccount.css";

export function User({ user }) {
  const [state, setState] = useState();

  const handleChangePassword = () => {
    setState('');
  }

  const rating = (user => {
    const filteredAnswers = user.answers.filter(answer => answer !== null);

    const array = filteredAnswers.map(answer => answer.rating);

    if (array.length !== 0) {
    const sum = array.reduce((previous, current) => current += previous);
    const avg = sum / array.length;

    return (Math.round(avg * 10)/10);
    }

    return 0;
  }); 

  const ratings = (user => {
    const filteredAnswers = user.answers.filter(answer => answer !== null);

    const array = filteredAnswers.map(answer => answer.ratings);

    if (array.length !== 0) {
    const sum = array.reduce((previous, current) => current += previous);

    return sum;
    }

    return 0;
  })

  return (
    <React.Fragment>
    <body className="userBody">
    <section className='card-container'>
        { user.avatarURL !== null &&
        <img className="round" src={user.avatarURL} alt="profile photo" />
        }
        { user.avatarURL === null &&
          <img className="round" src={require('../images/profile1.png')} alt="profile photo" />
        }
        <h3 className="userName">Nombre: {user.userName}</h3>
        <h4 className="data">Correo electrónico: {user.email}</h4>
        <h4 className="data">Rol: {user.role}</h4>
        { user.role !== 'User' &&
        <h4 className='data'>Rating: {rating(user)}/{ratings(user)}</h4>
        }
        <hr className='line'></hr>

        <div className="Profilebutton">

          { state === undefined &&
            <React.Fragment>
            <button className="primary" onClick={handleChangePassword}>
              Cambiar contraseña
            </button>

            <UploadProfilePhoto />

            { user.role === 'User' &&
              <div className="expertwannabe">
                <p>¿Quieres ser un 'Expert' y empezar a contestar preguntas?</p>
                <a href='https://forms.gle/ywH3TYFJJvBsUYWc9' target='_blank'>
                  <strong>¡Clicka aquí!</strong>
                </a>
              </div>
            }
            </React.Fragment>

          }

          { state !== undefined && 
            <ChangePassword />
          }   

    </div>
    </section>
    </body>
    </React.Fragment>
  )
}
