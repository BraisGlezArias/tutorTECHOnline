import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { uploadAvatar } from '../http/usersService';

import '../css/form.css';

export function UploadProfilePhoto() {
  const [file, setFile] = useState();
  const history = useHistory();

  const handleFormSubmit = e => {
    e.preventDefault();
    photoUpload(file).then(response => {
      console.log(response.data);
      history.push('/');
      history.push('/myaccount');
    });
  };

  const handleChange = e => {
    setFile({ file: e.target.files[0] });
  };

  const photoUpload = file => {
    const formData = new FormData();
    formData.append('avatar', file.file);
    return uploadAvatar(formData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h4>Subir foto de perfil:</h4>
      <input type="file" onChange={handleChange} />
      <button type="submit" className="primary">Subir foto</button>
    </form>
  );
}

export default UploadProfilePhoto;
