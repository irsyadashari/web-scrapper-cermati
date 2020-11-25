let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');
const { title } = require('process');

let baseURL = 'https://www.cermati.com/artikel'

axios.get(baseURL)
    .then(response => {
        if(response.status == 200){
            const html = response.data;
            const $ = cheerio.load(html);
            let artictlesLinkList = [];

            $('.article-list-item').each(function(i, element){
                artictlesLinkList[i] ={
                    url: $(this).find('a').attr('href')
                    //  title: $(this).find('.item-title').text,
                    // postingDate: $(this).find('').text
                    // author = $(this).find('h3').text.trim(),
                    // relatedArticles = $(this).find('h3').text.trim(),
                }
            });



            console.log(artikelLinkList)

            // $('.article-list-item').each((i, element) => {
            
            //     console.log($(element)
            //         .find('a')
            //         .attr('href')) // ini linknya

            //     console.log($(element).find('a')
            //         .children('.item-text-holder')
            //         .children('.item-title')
            //         .text()) // ini judulna

            //     console.log($(element)
            //         .find('a')
            //         .children('.item-text-holder')
            //         .children('.item-description')
            //         .children('.item-item-publish-date')
            //         .find('data-datetime')
            //         .text())
            // });

            

            // const artikelListTrim = artikelLinkList.filter(n => n != undefined)
            // fs.writeFile('data/solution.json',
            //     JSON.stringify(artikelListTrim, null, 4), (err) => {
            //         console.log('Writing Scrape files success')
            //     });
        }
    }), (error) => console.log(err);

