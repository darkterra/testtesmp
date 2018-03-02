import { h, Component } from '../../../libs/node_modules/preact';


export default class Geolocation extends Component {
  constructor (props) {
    super(props);

    this.state = {
      pos: {
        coords: {}
      }
    }
  }

  componentDidMount() {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.setState({
          pos: pos
        });
      })
    }
  }

  render(props, {pos}) {
    return !(navigator && navigator.geolocation)
    ? <div>Your browser does not support Geolocation</div>
    : <table>
        <tbody>
          <tr><td>latitude:</td><td>{pos.coords.latitude}</td></tr>
          <tr><td>longitude:</td><td>{pos.coords.longitude}</td></tr>
        </tbody>
      </table>
  }
}