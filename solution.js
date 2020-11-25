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
    let articlesArray = [] // the final JSON
    
    artictlesLinkList.forEach((element, i) => {
        
        axios.get(baseURL.concat(element.url))
            .then(response => {
            if(response.status == 200){
                const html = response.data;
                const selector = cheerio.load(html);     
                const url = baseURL.concat(element.url)
                const title = selector('.post-title').text()
                const author = selector('.author-name').text()
                const postDate = selector('.post-date').text() 
                
                let relatedArticles = [];

                selector('.panel-items-list > li').each((i, element) => {
                    let articleTailLink = selector(element).find('a').attr('href')
                    let reformatTailLink = articleTailLink.replace(articleTailLink.charAt(0), "")

                    let articleLink = baseURL.concat(reformatTailLink)

                    let clearLink = articleTailLink.replace(/[^a-zA-Z ]/g, " ")
                    let clearSpaceLink = clearLink.replace(clearLink.charAt(0),"")
                    let formattedLink = clearSpaceLink.substr(clearSpaceLink.indexOf(" ") + 1)

                    let title = formattedLink.replace(/^\w/, function(c) {
                        return c.toUpperCase();
                    });

                    relatedArticles[i] = {
                        url : articleLink,
                        title : title
                    }

                })
                
                articlesArray[i] = {
                    url: url,
                    title: title,
                    postingDate: postDate.trim(),
                    author: author.trim(),
                    relatedArticles: relatedArticles
                }  
                
                writeJSONFile(articlesArray)

        }
    }), (error) => console.log(err);
        
    });

}

async function writeJSONFile(articlesArray){

    var articlesObject = {
        articles: articlesArray
    }
    
    fs.writeFile('solution.json',
                JSON.stringify(articlesObject, null, 4), (err) => {
                    console.log('Writing Scrape files success')
                });
}

getArticlesURL()