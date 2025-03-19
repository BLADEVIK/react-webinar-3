/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = {
      ...initState,
      list: initState.list.map(item => ({
        ...item,
        selectionCount: 0
      }))
    };
    this.listeners = []; // Слушатели изменений состояния
    // Находим максимальный существующий код при инициализации
    this.lastCode = Math.max(...initState.list.map(item => item.code), 0);
  }

  /**
   * Получение следующего уникального кода
   * @returns {number}
   */
  getNextCode() {
    return ++this.lastCode;
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    };
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener();
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    this.setState({
      ...this.state,
      list: [...this.state.list, { 
        code: this.getNextCode(), 
        title: 'Новая запись',
        selectionCount: 0
      }],
    });
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.filter(item => item.code !== code),
    });
  }

  /**
   * Выделение записи по коду
   * @param code {number} Код записи
   * @param multiSelect {boolean} Режим множественного выделения
   */
  selectItem(code, multiSelect = false) {
    this.setState({
      ...this.state,
      list: this.state.list.map(item => {
        const willBeSelected = multiSelect 
          ? (item.code === code ? !item.selected : item.selected)
          : (item.code === code ? !item.selected : false);
        
        // Увеличиваем счетчик только если элемент становится выделенным
        const newSelectionCount = (item.code === code && !item.selected && willBeSelected) 
          ? (item.selectionCount || 0) + 1 
          : (item.selectionCount || 0);

        return {
          ...item,
          selected: willBeSelected,
          selectionCount: newSelectionCount
        };
      })
    });
  }
}

export default Store;
