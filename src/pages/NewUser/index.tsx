import axios from 'axios';
import toast from 'react-hot-toast';

import { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';

import styles from './styles.module.scss';

export default function NewUser() {
  const [birthdate, setBirthdate] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarMime, setAvatarMime] = useState('');

  const history = useHistory();

  function toBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarMime(file.type);
        resolve((reader.result as string).split(',')[1]);
      }
      reader.onerror = error => reject(error);
    });
  }

  async function fileSelected(event: React.ChangeEvent) {
    const file = (event.target as HTMLInputElement).files?.[0];

    try {
      if (file) {
        setAvatar(await toBase64(file));
      } else {
        toast.error('Error reading file');
      }
    } catch (e) {
      toast.error('Error reading file');
      console.error(e);
    }
  }

  function register(event: React.FormEvent) {
    event.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/user`, {
      birthdate,
      name,
      avatar,
      avatarMime
    }).then(() => {
      toast.success('User successfully registered.');
      history.push('/');
    }).catch((error) => {
      toast.error(error.message);
    });
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link className={styles.backButton} to="/">
            <FiArrowLeft />
          </Link>
          <h1>Register new user</h1>
        </div>
        <form onSubmit={register}>
          <div className={styles.avatarFormContainer}>
            <div className={styles.avatarContainer}>
              { avatar.length > 0 ? (
                <img src={`data:${avatarMime};base64,${avatar}`} alt={name} />
              ) : (
                <span>Upload</span>
              ) }
            </div>
            <div className={styles.labelContainer}>
              <label htmlFor="avatar">Upload Avatar</label>
            </div>
            <input
              id="avatar"
              name="avatar"
              onChange={fileSelected}
              required
              type="file"
            />
            <span>Recommended dimensions: 200x200</span>
          </div>
          <label htmlFor="fullname">
            <fieldset>
              <legend>Full name</legend>
              <input
                id="fullname"
                name="fullname"
                onChange={(e) => setName(e.target.value)}
                required
                type="text"
                value={name}
              />
            </fieldset>
          </label>
          <label htmlFor="birthdate">
            <fieldset>
              <legend>Date of birth</legend>
              <input
                id="birthdate"
                name="birthdate"
                onChange={(e) => setBirthdate(e.target.value)}
                required
                type="date"
              />
            </fieldset>
          </label>
          <input type="submit" value="Register" />
        </form>
      </div>
    </div>
  );
}