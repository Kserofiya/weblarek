import './scss/styles.scss';

// Импорты моделей данных
import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

// Импорт для работы с API
import { Api } from './components/base/Api';
import { AppApi } from './components/AppApi';

// Импорт констант
import { API_URL } from './utils/constants';

// Импорт моковых данных
import { apiProducts } from './utils/data';

// ============================================
// 1. НАСТРОЙКА API
// ============================================

console.log('API_URL:', API_URL);

const api = new Api(API_URL);
const appApi = new AppApi(api);

// ============================================
// 2. СОЗДАНИЕ ЭКЗЕМПЛЯРОВ МОДЕЛЕЙ
// ============================================

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

// ============================================
// 3. ТЕСТИРОВАНИЕ МОДЕЛЕЙ С МОКОВЫМИ ДАННЫМИ
// ============================================

console.log('\n' + '='.repeat(60));
console.log('ТЕСТИРОВАНИЕ МОДЕЛИ КАТАЛОГА (моковые данные)');
console.log('='.repeat(60));

// Устанавливаем моковые данные
productsModel.setItems(apiProducts.items);
console.log('setItems() - моковые данные сохранены');

// Проверяем getItems()
console.log('getItems() - товары в каталоге:', productsModel.getItems());
console.log(`getItems() - всего товаров: ${productsModel.getItems().length}`);

// Проверяем getProductById()
const testProduct = productsModel.getProductById(apiProducts.items[0].id);
console.log(`getProductById() - товар с ID "${apiProducts.items[0].id}":`, testProduct);

// Проверяем getProductById() с несуществующим ID
const unknownProduct = productsModel.getProductById('non-existent-id');
console.log('getProductById() - несуществующий ID:', unknownProduct);

// Проверяем setSelectedProduct() и getSelectedProduct()
productsModel.setSelectedProduct(apiProducts.items[0]);
console.log('setSelectedProduct() - выбран товар:', productsModel.getSelectedProduct());


console.log('\n' + '='.repeat(60));
console.log('ТЕСТИРОВАНИЕ МОДЕЛИ КОРЗИНЫ (моковые данные)');
console.log('='.repeat(60));

// Проверяем начальное состояние
console.log('getItems() - корзина пуста:', basketModel.getItems());
console.log(`getCount() - товаров в корзине: ${basketModel.getCount()}`);
console.log(`getTotalPrice() - стоимость: ${basketModel.getTotalPrice()} ₽`);

// Добавляем товар в корзину
const productForBasket = apiProducts.items[0];
basketModel.addItem(productForBasket);
console.log(`addItem() - добавлен товар: "${productForBasket.title}"`);
console.log('getItems() - товары в корзине:', basketModel.getItems());
console.log(`getCount() - товаров в корзине: ${basketModel.getCount()}`);
console.log(`getTotalPrice() - стоимость: ${basketModel.getTotalPrice()} ₽`);

// Проверяем isProductInBasket()
console.log(`isProductInBasket() - товар "${productForBasket.title}" в корзине: ${basketModel.isProductInBasket(productForBasket.id) ? 'Да' : 'Нет'}`);
console.log(`isProductInBasket() - несуществующий товар в корзине: ${basketModel.isProductInBasket('non-existent-id') ? 'Да' : 'Нет'}`);

// Удаляем товар
basketModel.removeItem(productForBasket.id);
console.log(`removeItem() - удален товар: "${productForBasket.title}"`);
console.log(`getCount() - товаров в корзине: ${basketModel.getCount()}`);
console.log(`getTotalPrice() - стоимость: ${basketModel.getTotalPrice()} ₽`);

// Проверяем clear()
basketModel.addItem(productForBasket);
basketModel.clear();
console.log('clear() - корзина очищена');
console.log(`getCount() - товаров в корзине: ${basketModel.getCount()}`);


console.log('\n' + '='.repeat(60));
console.log('ТЕСТИРОВАНИЕ МОДЕЛИ ПОКУПАТЕЛЯ (моковые данные)');
console.log('='.repeat(60));

// Проверяем начальное состояние
console.log('getData() - начальное состояние:', buyerModel.getData());

// Проверяем validate() с пустыми данными
console.log('validate() - ошибки при пустых данных:', buyerModel.validate());

// Устанавливаем данные
buyerModel.setPayment('card');
buyerModel.setAddress('Москва, ул. Тверская, 1');
buyerModel.setEmail('test@mail.ru');
buyerModel.setPhone('+79991234567');
console.log('setPayment(), setAddress(), setEmail(), setPhone() - данные сохранены');

// Проверяем getData()
console.log('getData() - данные покупателя:', buyerModel.getData());

// Проверяем validate() с заполненными данными
console.log('validate() - ошибок нет:', buyerModel.validate());

// Проверяем частичное обновление
buyerModel.setAddress('Санкт-Петербург, Невский пр., 10');
console.log('setAddress() - адрес обновлен');
console.log('getData() - данные покупателя после обновления адреса:', buyerModel.getData());

// Проверяем clear()
buyerModel.clear();
console.log('clear() - данные очищены');
console.log('getData() - после очистки:', buyerModel.getData());
console.log('validate() - ошибки после очистки:', buyerModel.validate());


// ============================================
// 4. ЗАПРОС К СЕРВЕРУ (getProducts)
// ============================================

console.log('\n' + '='.repeat(60));
console.log('ЗАГРУЗКА ДАННЫХ С СЕРВЕРА');
console.log('='.repeat(60));

// Запрос к серверу через AppApi
appApi.getProducts()
    .then(data => {
        // Сохраняем данные в модель
        productsModel.setItems(data.items);
        
        // Выводим результат в консоль
        console.log('GET /product - запрос выполнен успешно');
        console.log(`Получено ${data.total} товаров с сервера`);
        console.log('getItems() - массив товаров из модели:', productsModel.getItems());
        console.log(`getItems() - всего товаров в каталоге: ${productsModel.getItems().length}`);
        console.log(`Первый товар: "${productsModel.getItems()[0]?.title}" (${productsModel.getItems()[0]?.price} ₽)`);
    })
    .catch(error => {
        console.error('Ошибка загрузки с сервера:', error);
    });


// ============================================
// 5. ИТОГОВЫЙ СТАТУС (для наглядности)
// ============================================

console.log('\n' + '='.repeat(60));
console.log('ИТОГОВЫЙ СТАТУС МОДЕЛЕЙ');
console.log('='.repeat(60));
console.log(`- Каталог: ${productsModel.getItems().length} товаров`);
console.log(`- Корзина: ${basketModel.getCount()} товаров`);
console.log(`- Покупатель: ${buyerModel.getData().email || 'Не заполнен'}`);
console.log('\nВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!');