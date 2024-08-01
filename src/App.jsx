/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useCallback, useMemo } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const enhancedProducts = productsFromServer.map(product => {
  const productCategory = categoriesFromServer.find(
    category => category.id === product.categoryId,
  );
  const categoryOwner = usersFromServer.find(
    user => user.id === productCategory.ownerId,
  );

  return {
    ...product,
    category: productCategory,
    user: categoryOwner,
  };
});

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const filteredProducts = useMemo(() => {
    return enhancedProducts
      .filter(product =>
        selectedUserId ? product.user.id === selectedUserId : true,
      )
      .filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .filter(
        product =>
          selectedCategoryIds.length === 0 ||
          selectedCategoryIds.includes(product.category.id),
      );
  }, [selectedUserId, searchQuery, selectedCategoryIds]);

  const handleSearchInputChange = useCallback(event => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleResetAllFilters = useCallback(() => {
    setSelectedUserId(null);
    setSearchQuery('');
    setSelectedCategoryIds([]);
  }, []);

  const handleCategoryToggle = useCallback(categoryId => {
    setSelectedCategoryIds(prevSelectedIds => {
      if (prevSelectedIds.includes(categoryId)) {
        return prevSelectedIds.filter(id => id !== categoryId);
      }

      return [...prevSelectedIds, categoryId];
    });
  }, []);

  const handleAllCategoriesSelect = useCallback(() => {
    setSelectedCategoryIds([]);
  }, []);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUserId === null ? 'is-active' : ''}
                onClick={() => setSelectedUserId(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleSearchClear}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <button
                data-cy="AllCategories"
                type="button"
                className={`button mr-6 ${selectedCategoryIds.length === 0 ? 'is-success' : 'is-success is-outlined'}`}
                onClick={handleAllCategoriesSelect}
              >
                All
              </button>

              {categoriesFromServer.map(category => (
                <button
                  key={category.id}
                  data-cy="Category"
                  type="button"
                  className={`button mr-2 my-1 ${selectedCategoryIds.includes(category.id) ? 'is-info' : ''}`}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  {category.title}
                </button>
              ))}
            </div>

            <div className="panel-block">
              <button
                data-cy="ResetAllButton"
                type="button"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAllFilters}
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
