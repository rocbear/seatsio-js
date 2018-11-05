const Page = require('../Page.js');
const Chart = require('./Chart.js');

class IterableChartPages{
  constructor(url, client, params = null){
    this.pages = []; //array of pages (a page is an array of charts)
    this.client = client;
    this.url = url;
    this.params = params;
  }

  pageCreator(data, afterId, prevId){
    var charts = data.items.map((chartData) => {
      return new Chart(chartData.name, chartData.id, chartData.key, chartData.status, chartData.tags,
        chartData.publishedVersionThumbnailUrl, chartData.publishedVersionThumbnailUrl, chartData.events, chartData.archived);
    });
    var page = new Page(charts, afterId, prevId);
    this.pages.push(page);
    return page;
  }

  fetch(fetchParams = null){
    if(fetchParams === null){
      var fetchParams = {};
    }
    return this.client.get(this.url, {params: fetchParams})
            .then( (res) => {
              if(res.data.next_page_starts_after){
                this.next_page_starts_after = res.data.next_page_starts_after;
                this.fetchNextPage = true;
              }
              return {value: this.pageCreator(res.data, res.data.next_page_starts_after, res.data.previous_page_ends_before), done: false}
            });
  }

  fetchAfter(afterId, fetchParams = null){
    if(fetchParams === null){
      var fetchParams = {};
    }
    fetchParams.start_after_id = afterId;
    return this.client.get(this.url, {params: fetchParams})
                      .then( (res) => {
                        if(res.data.next_page_starts_after){
                          this.next_page_starts_after = res.data.next_page_starts_after;
                          this.fetchNextPage = true;
                        } else {
                          this.fetchNextPage = false;
                        }
                        return {value: this.pageCreator(res.data, res.data.next_page_starts_after, res.data.previous_page_ends_before), done: false}
                      });
  }

  firstPage(){
    return this.fetch();
  }

  subsequentPage(n){
    return this.fetchAfter(n);
  }

  [Symbol.asyncIterator](){
    var _this = this;

    return {
      next(){
      if(_this.pages.length == 0){
        return _this.fetch(_this.params);
      } else if(_this.fetchNextPage){
        return _this.subsequentPage(_this.next_page_starts_after, _this.params);
      }
      else {
        return {undefined, done: true};
      }
    }
  };
  }
}

module.exports = IterableChartPages;
