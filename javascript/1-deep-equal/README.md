# Homework 1. JavaScript. DeepEqual

## About

Here you can find the code dedicated to the first task of javascript block. It implements deepEqual function in Vanilla JS.

## Description
The task originally sounds as following:

> Необходимо разработать функцию deepEqual, которая будет проводить глубокое сравнение между переданными объектами actual и expected. Под глубоким сравнением понимается то, что собственные свойства дочерних объектов также рекурсивно сравниваются. Если объекты не идентичны, вывести ошибку с путем до неидентичного свойства (например, используя нотацию JSON Path - $.store.book.author). Идеальную функцию сравнения написать невозможно, поэтому постарайтесь реализовать самые важные моменты:
> * Рекурсия останавливается, когда найдено отличие
> * Сравниваются собственные итерируемые свойства, без учета прототипа
> * Важно реализовать сравнение примитивных свойств, итерирование массивов и объектов
```
const obj1 = {
    a: { b: 1 },
};
const obj2 = {
    a: { b: 2 },
};
const obj3 = {
    a: { b: 1 },
};
deepEqual(obj1, obj1);
// OK
deepEqual(obj1, obj2);
// Error: a.b
deepEqual(obj1, obj3);
// OK
```
> Дополнительные материалы: https://nodejs.org/api/assert.html#assertdeepequalactual-expected-message
