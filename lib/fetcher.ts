/**
 * Сразу возвращает данные с сервера без промисов
 */

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
