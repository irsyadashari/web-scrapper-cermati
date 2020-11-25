let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');
const { title } = require('process');

async function getArticlesURL(){
    let articlesURL = 'https://www.cermati.com/artikel'
    axios.get(articlesURL)
    .then(response => {
        if(response.status == 200){
            const html = response.data;
            const $ = cheerio.load(html);
            let artictlesLinkList = [];

            $('.article-list-item').each((i, element) => {
                artictlesLinkList[i] = {
                        url: $(element).find('a').attr('href')
                }
            });
            scrapeArticles(artictlesLinkList);

        }
    }), (error) => console.log(err);
}

async function scrapeArticles(artictlesLinkList){

    let baseURL = 'https://www.cermati.com/'
    let articlesArray = [] // inimi yang dibungkus ke dalam JSON nanti kalo udah
    
    artictlesLinkList.forEach((element, i) => {
        
        axios.get(baseURL.concat(element.url))
            .then(response => {
            if(response.status == 200){
                const html = response.data;
                const selector = cheerio.load(html);
                            
                const url = baseURL.concat(element.url)
                // console.log(url)

                const title = selector('.post-title').text()
                // console.log(title)

                const author = selector('.author-name').text()
                // console.log(author)
                
                const postDate = selector('.post-date').text()
                // console.log(postDate)  
                
                let relatedArticles = [];

                selector('.panel-items-list > li').each((i, element) => {
                    let articleTailLink = selector(element).find('a').attr('href')
                    let articleLink = baseURL.concat(articleTailLink)
                    
                    relatedArticles[i] = {
                        article : articleLink
                    }
                    
                })
                // console.log(relatedArticles)

                // console.log('_________________________________________________________')  
                // console.log('---------------------------------------------------------')   
                
                articlesArray[i] = {
                    url: url,
                    title: title,
                    postingDate: postDate.trim(),
                    author: author.trim(),
                    relatedArticles: relatedArticles
                }  
                
                writeJSONFile(articlesArray)
                // console.log(articlesArray)
        }
    }), (error) => console.log(err);
        
    });

}

function writeJSONFile(articlesArray){
    
    const artikelToWrite = articlesArray.filter(n => n != undefined)

    fs.writeFile('data/solution.json',
                JSON.stringify(artikelToWrite, null, 4), (err) => {
                    console.log('Writing Scrape files success')
                });
}

getArticlesURL()