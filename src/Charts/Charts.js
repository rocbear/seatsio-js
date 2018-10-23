const PageFetcher = require('../PageFetcher.js');
const Chart = require('./Chart.js');

class Charts {
  constructor(client){
    this.client = client;
    //more code here
  }

  create(name = null, venueType = null, categories = null){
    var requestParams = {};

    if(name !== null){
      requestParams.name = name;
    }

    if(venueType !== null){
      requestParams.venueType = venueType;
    }

    if(categories !== null){
      requestParams.categories = categories;
    }

    var promise = this.client.post('charts', requestParams)
                          .then( (res) => res.data );

    //need to map result into the Chart class
    return promise;
  }

  addTag(key, tag){
    var url = `charts/${key}/tags/${encodeURIComponent(tag)}`;
    var promise = this.client.post(url).then( (res) => res.data );
    return promise;
  }

  removeTag(key, tag){
    var url = `charts/${key}/tags/${encodeURIComponent(tag)}`;
    return this.client.delete(url).then( (res)=> res.data );
  }

  retrieve(key){
    var promise = this.client.get(`charts/${key}`).then( (res) => res.data);
    return promise;
  }

  retrievePublishedVersion(key){
    var promise = this.client.get(`charts/${key}/version/published`).then( (res) => res.data);
    return promise;
  }

  listAllTags(){
    return this.client.get('/charts/tags').then( (res) => res.data.tags );
  }

  copy(key){
    return this.client.post(`charts/${key}/version/published/actions/copy`).then( (res) => res.data);
  }
}

module.exports = Charts;
