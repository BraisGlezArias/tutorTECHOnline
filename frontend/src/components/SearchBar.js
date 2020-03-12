import React, { useState } from 'react';

import "../css/searchbar.css";

export function SearchBar() {
    const [state, setState] = useState({ searchText:''})

    return (
        <React.Fragment>
            <div className='search'>
                <img class="search-icon" src={require('../images/binoculars.png')} />
                <input
                    className='searchBar'
                    id='searchBar'
                    type='search'
                    placeholder='Busca un término aquí...'
                    value={state.searchText}
                    onChange={e => setState(e.target.value)}
                    onKeyDown={e => (e.keyCode === 13) ? window.location.replace(`/buscar?p=${state}`) : null}
                />
            </div>
        </React.Fragment>
    )
}

