import React from 'react';
import { createElement } from './utils.js';
import './styles.css';

/**
 * Приложение
 * @param store {Store} Состояние приложения
 * @returns {React.ReactElement}
 */
function App({ store }) {
  const list = store.getState().list;

  const handleItemClick = (e, code) => {
    // Предотвращение всплытия событий
    e.stopPropagation();
    // Проверьте, нажата ли клавиша Ctrl (Windows) или Cmd (Mac)
    const multiSelect = e.ctrlKey || e.metaKey;
    store.selectItem(code, multiSelect);
  };

  return (
    <div className="App">
      <div className="App-head">
        <h1 className='title'>Приложение на чистом JS</h1>
      </div>
      <div className="App-controls">
        <button className='btn-add' onClick={() => store.addItem()}><span className='btn-text'>Добавить</span></button>
      </div>
      <div className="App-center">
        <div className="List">
          {list.map(item => (
            <div key={item.code} className="List-item">
              <div
                className={'Item' + (item.selected ? ' Item_selected' : '')}
                onClick={(e) => handleItemClick(e, item.code)}
              >
                <div className="Item-code">{item.code}</div>
                <div className="Item-title">
                  {item.title}
                  {item.selectionCount > 0 && 
                    <span className="Item-selections"> | Выделяли {item.selectionCount} раз</span>
                  }
                </div>
                <div className="Item-actions">
                  <button className='btn-delete' onClick={(e) => {
                    e.stopPropagation();
                    store.deleteItem(item.code);
                  }}><span className='btn-text'>Удалить</span></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
