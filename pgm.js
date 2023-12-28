// Открытия файла и добавление в него пагинации по файлам Markdown.

/**
 * Подключение своего модуля
 */
// import {twerdo_template} from './tempug.js'


import fs from "fs";
import path from "path";
//////////////////////////////
const az_path = path.join("./");
///////////////////////////////

/**
 * Массив отобранных страниц
 */
let fita_favoritePages = [];
const azbuka = [
  "az", "buki", "vedi", "glagol", "dobro", "esty", "jivete", "zemlya", "selo", "ige", "ii", "kakw", "ludie", "mislete", "nash", "on", "pokoy", "omega", "rci", "slovo", "twerdo", "uk", "fert", "her", "wt", "cii", "cherv", "sha", "shya", "er", "eri", "yaty", "uy", "ya", "us", "rsi", "psi", "fita", "igica", ];

try {
  /**
   * Считываем файлы из директории
   */
  fs.promises.readdir(az_path + "docs/", (_err, pokoy_pages) => {
    return pokoy_pages;
  })
    .then((pokoy_pages) => {
      if (pokoy_pages.length > 0) {
        for (const elem of pokoy_pages) {
          console.log(az_path + "docs/" + elem);
          let fileOrDiectory = fs.statSync(az_path + "docs/" + elem).isFile();
          if (
            fileOrDiectory &&
            elem.substring(elem.length - 3).toLowerCase() == ".md"
          ) {
            for (let elem2 of azbuka) {
              if (elem.search(elem2) == 0) {
                fita_favoritePages.push(elem);
                continue;
              }
            }
          }
        }
        return fita_favoritePages;
      } else return "ПУСТО В ПАПКЕ !";
    })
    .then((data) => {
      let backward = "#";
      let forward = "#";

      // получаем содержимое файла для чтения и перезапись
      for (let i = 0; i < data.length; i = i + 1) {
        if (i === 0) {
          backward = "readme.md";
        } else {
          backward = data[i - 1];
        }
        forward = data[i + 1] ?? "readme.md";

        // ТОЛЬКО СИНХРОННО `Sync`
        let fileContent = fs.readFileSync(
          `${az_path}docs/${data[i]}`,
          "utf8"
        )

        {
          let filecontentLength = fileContent.length;

          // В данном шаблоне-строке не должно быть пробелов между комментариями HTML
          let twerdo_template =`<!--ystm_start-->\n<!-- Не удаляйте закомментированнные метки с префиксом: ystm_ -->\n<br>\n\n||||\n|:---|:---:|---:|\n[← назад](${backward})|[${i + 1}](#)|[далее →](${forward})\n\n<br>\n<!--ystm_end-->\n`;
          // Вычисления и замена ссылок пагинации для иттерации.
          let ystart = "<!--ystm_start-->";
          let yend = "<!--ystm_end-->";
          let a = fileContent.indexOf(ystart);
          let b = fileContent.indexOf(yend);
          let c = yend.length;
          let res = fileContent.substring(a, b + c + 3);
          let updateContent = fileContent.replace(res, twerdo_template);
          // FIX: Здесь можно усовершенствовать механизм проверки
          // зачистки тегов пагинации, перед тем как встроить пагинацию.

          console.log(
            "\n\n<<--=================-->>\n",
            data[i],
            "\n<<--=========-->>\n",
            updateContent,
          );

          let cleanPage = ` # Страница ${
            data[i]
          } \n\n<!--===\nСтраница была создана с префиксом азбуки,\nно не имела никакого контента.\nПришлось добавить заголовок и комментарий.\nЧтобы удалить страницу из пагинации,\nможете просто удалить префикс азбуки из имени страницы.\n ===-->\n\n`;

          if (a != -1 || filecontentLength < "YS©TM-2023".length) {
            fs.writeFileSync(
              `${az_path}docs/${data[i]}`,
              cleanPage + updateContent,
            );
          }
          if (a == -1 && filecontentLength > "Lorem inpsum ...".length) {
            fs.appendFileSync(`${az_path}docs/${data[i]}`, twerdo_template);
          }
          if (a > 0 && filecontentLength > 7) {
            fs.writeFileSync(`${az_path}docs/${data[i]}`, updateContent);
          }
        
        }
      }
      return data;
    })
} 

catch (error) {
  console.error(error, "Иногда бывает не совсем так, как хотелось бы нам!!!");
}
