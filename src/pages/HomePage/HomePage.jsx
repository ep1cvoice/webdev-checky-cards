import { useState, useEffect } from 'react';
import { API_URL } from '../../constants';

import QuestionCardList from '../../components/QuestionCardList';
import { Loader } from '../../components/Loader';
import { useFetch } from '../../hooks/useFetch';
import SearchInput from '../../components/SearchInput';

import styles from './HomePage.module.css';

const HomePage = () => {
	const [questions, setQuestions] = useState([]);
	const [searchValue, setSearchValue] = useState('');

	const [getQuestions, isLoading, error] = useFetch(async (url) => {
		const response = await fetch(`${API_URL}/${url}`);
		const data = await response.json();

		setQuestions(data);
		return data;
	});

	useEffect(() => {
		getQuestions('react');
	}, []);

	const onSearchChangehandler = (e) => {
		setSearchValue(e.target.value);
	};

	return (
		<>
			<div className={styles.controlsContainer}>
				<SearchInput value={searchValue} onChange={onSearchChangehandler} />
			</div>

			{isLoading && <Loader />}
			{error && <p>{error}</p>}
			<QuestionCardList cards={questions} />
		</>
	);
};

export default HomePage;
