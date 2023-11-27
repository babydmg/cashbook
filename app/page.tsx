'use client';

import { auth, db } from '@/firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import styles from '@/styles/Home.module.css';
import { useState, useEffect, FormEvent } from 'react';

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [showCashInForm, setShowCaseInForm] = useState(false);
  const [showCashOutForm, setShowCaseOutForm] = useState(false);
  const [cashInTitle, setCashInTitle] = useState('');
  const [cashInCategory, setCashInCategory] = useState('Other');
  const [cashInAmount, setCashInAmount] = useState('');
  const [cashOutTitle, setCashOutTitle] = useState('');
  const [cashOutCategory, setCashOutCategory] = useState('Other');
  const [cashOutAmount, setCashOutAmount] = useState('');
  const [cashIn, setCashIn] = useState<[any] | any>(null);
  const [cashOut, setCashOut] = useState<[any] | any>(null);
  const [showAddNewCategory, setShowAddNewCategory] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState<[any] | any>(null);

  const provider = new GoogleAuthProvider();

  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      if (res == undefined) {
        setUser(null);
      } else {
        setUser({
          name: res.displayName,
          email: res.email,
          uid: res.uid,
          photo: res.photoURL,
        });

        onSnapshot(collection(db, 'cashIn'), (re) => {
          const cashInRecords = re.docs.filter((r) => r.data().uid == res.uid);
          setCashIn(cashInRecords);
        });

        onSnapshot(collection(db, 'cashOut'), (re) => {
          const cashOutRecords = re.docs.filter((r) => r.data().uid == res.uid);
          setCashOut(cashOutRecords);
        });

        onSnapshot(collection(db, 'categories'), (re) => {
          const categoriesRecords = re.docs.filter(
            (r) => r.data().uid == res.uid
          );
          setCategories(categoriesRecords);
        });
      }
    });
  }, []);

  const getStartedHandler = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        console.log(res.user.displayName);
        console.log(res.user.email);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loginHandler = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        console.log(res.user.displayName);
        console.log(res.user.email);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cashInBtn = () => {
    setShowCaseInForm((prev) => !prev);
    setShowCaseOutForm(false);
  };

  const cashOutBtn = () => {
    setShowCaseOutForm((prev) => !prev);
    setShowCaseInForm(false);
  };

  const handleCashInForm = async (e: FormEvent) => {
    e.preventDefault();

    await addDoc(collection(db, 'cashIn'), {
      amount: cashInAmount.replaceAll(',', ''),
      title: cashInTitle,
      date: `${new Date().getDate()}-${
        new Date().getMonth() + 1
      }-${new Date().getFullYear()}`,
      category: cashInCategory,
      uid: user.uid,
    });

    setCashInAmount('');
    setCashInCategory('Other');
    setCashInTitle('');
  };

  const handleCashOutForm = async (e: FormEvent) => {
    e.preventDefault();

    await addDoc(collection(db, 'cashOut'), {
      amount: cashOutAmount.replaceAll(',', ''),
      title: cashOutTitle,
      date: `${new Date().getDate()}-${
        new Date().getMonth() + 1
      }-${new Date().getFullYear()}`,
      category: cashOutCategory,
      uid: user.uid,
    });

    setCashOutAmount('');
    setCashOutCategory('Other');
    setCashOutTitle('');
  };

  const handleNewCategory = async (e: FormEvent) => {
    e.preventDefault();

    await addDoc(collection(db, 'categories'), {
      category: categoryName,
      uid: user.uid,
    });

    setCategoryName('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <h1>Cashbook</h1>

        {user == undefined ? (
          <div className={styles.authBtnContainer}>
            <button
              className={styles.getStartedBtn}
              onClick={getStartedHandler}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='1em'
                viewBox='0 0 488 512'>
                <style>{`svg{fill:#ffffff; margin-right: 0.5rem}`}</style>
                <path d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z' />
              </svg>
              Get Started with Google
            </button>
            <button className={styles.loginBtn} onClick={loginHandler}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='1em'
                viewBox='0 0 488 512'>
                <style>{`svg{fill:#ffffff; margin-right: 0.5rem}`}</style>
                <path d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z' />
              </svg>
              Login with Google
            </button>
          </div>
        ) : (
          <>
            <div className={styles.cashInOutBtnContainer}>
              <button className={styles.cashInBtn} onClick={cashInBtn}>
                Cash In
              </button>
              <button className={styles.cashOutBtn} onClick={cashOutBtn}>
                Cash Out
              </button>
              <button
                className={styles.addCategoryBtn}
                onClick={() => {
                  setShowAddNewCategory((prev) => !prev);
                  setShowCaseInForm(false);
                  setShowCaseOutForm(false);
                }}>
                Add Category
              </button>
            </div>
            {showAddNewCategory ? (
              <form
                className={styles.addNewCategoryForm}
                onSubmit={handleNewCategory}>
                <label>Category Name</label>
                <input
                  type='text'
                  className={styles.newCategoryInput}
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />

                <button className={styles.addNewCategoryBtn}>Add</button>
                <button
                  className={styles.addNewCategoryBtn}
                  onClick={() => setShowAddNewCategory(false)}>
                  X
                </button>
              </form>
            ) : (
              ''
            )}
            {showCashInForm ? (
              <form className={styles.cashInForm} onSubmit={handleCashInForm}>
                <div>
                  <label>Title</label>
                  <input
                    type='text'
                    className={styles.cashInInput}
                    value={cashInTitle}
                    onChange={(e) => setCashInTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label>Amount</label>
                  <input
                    type='text'
                    className={styles.cashInInput}
                    value={cashInAmount}
                    onChange={(e) => setCashInAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label>Category</label>
                  <select
                    value={cashInCategory}
                    onChange={(e) => setCashInCategory(e.target.value)}>
                    <option value='Other'>Other</option>
                    {categories.map((ca: any) => (
                      <option value={ca.data().category}>
                        {ca.data().category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <button className={styles.addCashInBtn}>Add</button>
                  <button
                    className={styles.addCashInBtn}
                    onClick={() => setShowCaseInForm(false)}
                    type='button'
                    style={{ marginLeft: '0.5rem' }}>
                    X
                  </button>
                </div>
              </form>
            ) : (
              ''
            )}

            {showCashOutForm ? (
              <form className={styles.cashInForm} onSubmit={handleCashOutForm}>
                <div>
                  <label>Title</label>
                  <input
                    type='text'
                    className={styles.cashInInput}
                    value={cashOutTitle}
                    onChange={(e) => setCashOutTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label>Amount</label>
                  <input
                    type='text'
                    className={styles.cashInInput}
                    value={cashOutAmount}
                    onChange={(e) => setCashOutAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label>Category</label>
                  <select
                    value={cashOutCategory}
                    onChange={(e) => setCashOutCategory(e.target.value)}>
                    <option value='Other'>Other</option>
                    {categories.map((ca: any) => (
                      <option value={ca.data().category}>
                        {ca.data().category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <button className={styles.addCashOutBtn}>Add</button>
                  <button
                    className={styles.addCashOutBtn}
                    onClick={() => setShowCaseOutForm(false)}
                    type='button'
                    style={{ marginLeft: '0.5rem' }}>
                    X
                  </button>
                </div>
              </form>
            ) : (
              ''
            )}

            <div
              style={{
                width: '80%',
                marginTop: '0.5rem',
              }}>
              {cashIn == undefined || cashIn == null
                ? ''
                : cashIn.map((result: any) => (
                    <div className={styles.cashInCard}>
                      <h3>
                        Title: <span>{result.data().title}</span>
                      </h3>
                      <h3>
                        Amount: <span>Rs. {result.data().amount}</span>
                      </h3>
                      <h3>
                        Date: <span>{result.data().date}</span>
                      </h3>
                      <h3>
                        Category: <span>{result.data().category}</span>
                      </h3>
                      <h3>
                        Type: <span>Cash In</span>
                      </h3>
                    </div>
                  ))}
            </div>

            <div
              style={{
                width: '80%',
              }}>
              {cashOut == undefined || cashOut == null
                ? ''
                : cashOut.map((result: any) => (
                    <div className={styles.cashOutCard}>
                      <h3>
                        Title: <span>{result.data().title}</span>
                      </h3>
                      <h3>
                        Amount: <span>Rs. {result.data().amount}</span>
                      </h3>
                      <h3>
                        Date: <span>{result.data().date}</span>
                      </h3>
                      <h3>
                        Category: <span>{result.data().category}</span>
                      </h3>
                      <h3>
                        Type: <span>Cash Out</span>
                      </h3>
                    </div>
                  ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
