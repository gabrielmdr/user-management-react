import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiEdit, FiSearch, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { User } from '../../shared/interfaces/User';

import styles from './styles.module.scss';

const PAGE_SIZE = Math.floor((Math.floor(window.innerHeight * 0.85) - 247) / 68);

export default function Home() {
  const [allUsers, setAllUsers] = useState(new Array<User>());
  const [lastIndex, setLastIndex] = useState(0);
  const [listLength, setListLength] = useState(0);
  const [queryInputValue, setQueryInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState(new Array<User>());

  function deleteUser(id: number, index: number) {
    if (window.confirm(`Are you sure you want to delete ${allUsers[index].name}?`)) {
      axios.delete(`${process.env.REACT_APP_API_URL}/user/${id}`).then(_ => {
        setAllUsers(users => {
          const newUsers = users;
          newUsers.splice(index, 1);
          return [...newUsers];
        });
        toast.success('User deleted successfully');
      }).catch((error) => {
        console.error(error);
        toast.error('Unknown error');
      });
    }
  }

  function prevPage() {
    if (page > 1) setPage(page - 1);
  }

  function nextPage() {
    if (page < totalPages) setPage(page + 1);
  }

  function search(e: React.FormEvent) {
    e.preventDefault();
    setQuery(queryInputValue.trim());
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/user`).then(response => {
      setAllUsers(response.data);
    });
  }, []);

  useEffect(() => {
    let pageOfUsers = [...allUsers];
    if (query !== '') {
      pageOfUsers = pageOfUsers.filter(user => user.name.includes(query));
    }
    setTotalPages(Math.ceil(pageOfUsers.length / PAGE_SIZE));
    setLastIndex(pageOfUsers.length > PAGE_SIZE ? PAGE_SIZE : pageOfUsers.length);
    setListLength(pageOfUsers.length);
    setUsers(pageOfUsers.splice(0, PAGE_SIZE));
  }, [allUsers, query]);
  
  useEffect(() => {
    let pageOfUsers = [...allUsers];
    pageOfUsers = pageOfUsers.splice(PAGE_SIZE * (page - 1), PAGE_SIZE)
    setUsers(pageOfUsers);
    setLastIndex(pageOfUsers.length === PAGE_SIZE ? page * PAGE_SIZE : (page - 1) * PAGE_SIZE + pageOfUsers.length);
  }, [page, allUsers]);
  
  return (
    <div className={styles.root}>
      <Toaster />
      <div className={styles.container}>
        <header>
          <h1>Users</h1>
          <Link className={styles.addButton} to="/user/new">Add</Link>
        </header>
        <main>
          <div className={styles.topBar}>
            <form onSubmit={search}>
              <label className={styles.inputContainer} htmlFor="search">
                <FiSearch />
                <input
                  id="search"
                  onChange={(e) => {setQueryInputValue(e.target.value)}}
                  placeholder="Search"
                  type="text"
                  value={queryInputValue}
                />
              </label>
            </form>
          </div>
          {
            users.length > 0 ? (
              <table className={styles.users} style={{
                marginBottom: `${(PAGE_SIZE - users.length) * 68}px`
              }}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Date of birth</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody style={{
                  height: `${users.length * 68}px`
                }}>
                  {
                    users.map((user, index) => {
                      return (
                        <tr key={user.id}>
                          <td>
                            <div className={styles.avatarContainer}>
                              <img src={`data:${user.avatarMime};base64, ${user.avatar as string}`} alt={user.name} />
                            </div>
                          </td>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{new Date(`${user.birthdate}T00:00:00`).toLocaleDateString()}</td>
                          <td>
                            <div className={styles.actions}>
                              <Link to={`/user/${user.id}/edit`} className={styles.editButton}>
                                <FiEdit />
                              </Link>
                              <button
                                className={styles.deleteButton}
                                onClick={() => {deleteUser(user.id!!, index)}}
                              >
                                <FiTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            ) : (
              <div className={styles.noUsers} style={{
                height: `${PAGE_SIZE * 68}px`
              }}>
                <h1>No users found</h1>
              </div>
            )
          }
          <div className={styles.bottomBar} style={{
            visibility: users.length > 0 ? 'visible' : 'hidden'
          }}>
            <span>{`${PAGE_SIZE * page - PAGE_SIZE + 1}-${lastIndex} to ${listLength}`}</span>
            <button
              className={styles.prevPageButton}
              disabled={page <= 1}
              onClick={() => {prevPage()}}
            >
              <FiChevronLeft />
            </button>
            <button
              className={styles.nextPageButton}
              disabled={page >= totalPages}
              onClick={() => {nextPage()}}
            >
              <FiChevronRight />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
