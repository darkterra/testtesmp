import { h, Component } from '../../../libs//node_modules/preact';
import request from '../../../libs//node_modules/superagent'

export default class HelloBack extends Component {
  constructor (props) {
    super(props);

    this.state = {
      response1: {},
      response2: {}
    }

    this.url = 'http://localhost/api';
  }

  componentDidMount() {
    var that = this;
    request.get(this.url).end(function(err, res) {
      console.log(res)
      if (err) {
        console.error(err);
      }
      if (res.text) {
        that.setState({
          response1: res.text
        });
      }
    });
    // request.get(this.url + '/jsonTest').end(function(err, res) {
    //   console.log(res)
    //   if (err) {
    //     console.error(err);
    //   }
    //   if (res.text) {
    //     that.setState({
    //       response2: res.text
    //     });
    //   }
    // });
  }

  render(props, {response1, response2}) {
    return <div>
      responseServer 1: {response1}
      <br />
      responseServer 2: {response2}
    </div>
  }
}