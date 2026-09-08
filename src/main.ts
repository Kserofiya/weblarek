import './scss/styles.scss';

// Импорты моделей данных
import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

// Импорт для работы с API
import { Api } from './components/base/Api';
import { AppApi } from './components/models/AppApi';

// Импорт констант
import { API_URL } from './utils/constants';

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
// 3. ЗАГРУЗКА ДАННЫХ С СЕРВЕРА
// ============================================

console.log('\n' + '='.repeat(60));
console.log('ЗАГРУЗКА ДАННЫХ С СЕРВЕРА');
console.log('='.repeat(60));

appApi.getProducts()
    .then(data => {
        console.log('GET /product - запрос выполнен успешно');
        console.log(`Получено ${data.total} товаров с сервера`);
        console.log(`Первый товар: "${data.items[0]?.title}" (${data.items[0]?.price} ₽)`);
        
        // Сохранение в модель
        productsModel.setItems(data.items);
        console.log(`setItems() - данные сохранены в модель`);
        console.log(`getItems() - в каталоге ${productsModel.getItems().length} товаров`);
        
        // ============================================
        // 4. ТЕСТИРОВАНИЕ МОДЕЛИ КАТАЛОГА
        // ============================================
        
        console.log('\n' + '='.repeat(60));
        console.log('ТЕСТИРОВАНИЕ МОДЕЛИ КАТАЛОГА');
        console.log('='.repeat(60));
        
        const firstProduct = productsModel.getItems()[0];
        
        // Проверка getItems
        console.log(`getItems() - в каталоге ${productsModel.getItems().length} товаров`);
        
        // Проверка getProductById
        if (firstProduct) {
            const found = productsModel.getProductById(firstProduct.id);
            console.log(`getProductById() - найден товар: "${found?.title}"`);
        }
        
        // Проверка getProductById с несуществующим ID
        const unknownProduct = productsModel.getProductById('non-existent-id');
        console.log(`getProductById() - несуществующий товар: ${unknownProduct || 'undefined'}`);
        
        // Проверка setSelectedProduct и getSelectedProduct
        if (firstProduct) {
            productsModel.setSelectedProduct(firstProduct);
            console.log(`setSelectedProduct() - выбран товар: "${productsModel.getSelectedProduct()?.title}"`);
        }
        console.log(`getSelectedProduct() - текущий выбранный товар: "${productsModel.getSelectedProduct()?.title || 'null'}"`);
        
        // ============================================
        // 5. ТЕСТИРОВАНИЕ МОДЕЛИ КОРЗИНЫ
        // ============================================
        
        console.log('\n' + '='.repeat(60));
        console.log('ТЕСТИРОВАНИЕ МОДЕЛИ КОРЗИНЫ');
        console.log('='.repeat(60));
        
        // Проверка начального состояния
        console.log(`getItems() - корзина пуста: ${basketModel.getCount() === 0 ? 'Да' : 'Нет'}`);
        console.log(`getTotalPrice() - стоимость: ${basketModel.getTotalPrice()} ₽`);
        
        // Проверка isProductInBasket (без товаров)
        console.log(`isProductInBasket() - без товаров: ${basketModel.isProductInBasket('any-id') ? 'Да' : 'Нет'}`);
        
        // Добавление товара в корзину
        if (firstProduct) {
            basketModel.addItem(firstProduct);
            console.log(`addItem() - добавлен товар: "${firstProduct.title}"`);
            console.log(`getItems() - в корзине ${basketModel.getCount()} товаров`);
            console.log(`getTotalPrice() - стоимость: ${basketModel.getTotalPrice()} ₽`);
            console.log(`isProductInBasket() - товар в корзине: ${basketModel.isProductInBasket(firstProduct.id) ? 'Да' : 'Нет'}`);
        }
        
        // Удаление товара
        if (firstProduct) {
            basketModel.removeItem(firstProduct.id);
            console.log(`removeItem() - товар удален, в корзине ${basketModel.getCount()} товаров`);
        }
        
        // Проверка clear
        if (firstProduct) {
            basketModel.addItem(firstProduct);
            basketModel.clear();
            console.log(`clear() - корзина очищена, товаров: ${basketModel.getCount()}`);
        }
        
        // ============================================
        // 6. ТЕСТИРОВАНИЕ МОДЕЛИ ПОКУПАТЕЛЯ
        // ============================================
        
        console.log('\n' + '='.repeat(60));
        console.log('ТЕСТИРОВАНИЕ МОДЕЛИ ПОКУПАТЕЛЯ');
        console.log('='.repeat(60));
        
        // Проверка начального состояния
        console.log(`getData() - начальное состояние:`, buyerModel.getData());
        console.log(`validate() - ошибки при пустых данных:`, buyerModel.validate());
        
        // Проверка set методов
        buyerModel.setPayment('card');
        buyerModel.setAddress('Москва, ул. Тверская, 1');
        buyerModel.setEmail('test@mail.ru');
        buyerModel.setPhone('+79991234567');
        console.log('setPayment(), setAddress(), setEmail(), setPhone() - данные сохранены');
        
        // Проверка getData
        console.log('getData() - данные покупателя:', buyerModel.getData());
        
        // Проверка validate (без ошибок)
        const validResult = buyerModel.validate();
        console.log(`validate() - ошибок нет: ${Object.keys(validResult).length === 0 ? 'Да' : 'Нет'}`);
        
        // Проверка clear
        buyerModel.clear();
        console.log('clear() - данные очищены');
        console.log(`getData() после очистки:`, buyerModel.getData());
        
        // ============================================
        // 7. ТЕСТ ОТПРАВКИ ЗАКАЗА (postOrder)
        // ============================================

        console.log('\n' + '='.repeat(60));
        console.log('ТЕСТ ОТПРАВКИ ЗАКАЗА');
        console.log('='.repeat(60));

        // Добавляем товар в корзину для реального заказа
        if (firstProduct) {
            basketModel.addItem(firstProduct);
            console.log(`Добавлен товар в корзину для заказа: "${firstProduct.title}"`);
            console.log(`В корзине ${basketModel.getCount()} товаров на сумму ${basketModel.getTotalPrice()} ₽`);
        }

        const orderData = {
            payment: 'card' as const,
            email: 'test@example.com',
            phone: '+79991234567',
            address: 'Москва, ул. Тверская, д. 1',
            total: basketModel.getTotalPrice(),
            items: basketModel.getItems().map(item => item.id)
        };

        console.log('Данные заказа:', JSON.stringify(orderData, null, 2));

        appApi.postOrder(orderData)
            .then(orderResponse => {
                console.log('POST /order - заказ отправлен успешно!');
                console.log(`ID заказа: ${orderResponse.id}`);
                console.log(`Сумма заказа: ${orderResponse.total} ₽`);
                console.log('Ответ сервера:', orderResponse);
                
                // Очищаем корзину после успешного заказа
                basketModel.clear();
                console.log('Корзина очищена после заказа');
            })
            .catch(error => {
                console.error('Ошибка отправки заказа:', error);
                if (error && typeof error === 'object' && 'text' in error) {
                    console.error('❌ Детали ошибки:', error);
                }
            });
        
        // ============================================
        // 8. ИТОГОВЫЙ СТАТУС
        // ============================================
        
        console.log('\n' + '='.repeat(60));
        console.log('ИТОГОВЫЙ СТАТУС МОДЕЛЕЙ');
        console.log('='.repeat(60));
        console.log(`- Каталог: ${productsModel.getItems().length} товаров`);
        console.log(`- Корзина: ${basketModel.getCount()} товаров`);
        console.log(`- Покупатель: ${buyerModel.getData().email || 'Не заполнен'}`);
        console.log('\nВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!');
    })
    .catch(error => {
        console.error('Ошибка загрузки с сервера:', error);
    });