import React from 'react';
import ReactDOM from 'react-dom';

import DesktopMixin from '../DesktopMixin';
import Modes from '../../../src/components/Modes';
import SereneCarousel from './SereneCarousel';
import SereneModes from './SereneModes';
import SereneTabButton from './SereneTabButton';
import SereneTabStrip from './SereneTabStrip';



const rooms = [
  {
    shortLabel: 'Standard',
    label: 'Standard Rooms',
    images: [
      <img key="standard1" src="images/serene/standard1.png" aria-label="Standard room wide-angle" />,
      <img key="standard2" src="images/serene/standard2.png" aria-label="Standard room with view of city" />,
      <img key="standard3" src="images/serene/standard3.png" aria-label="Standard shower" />,
      <img key="standard4" src="images/serene/standard4.png" aria-label="Standard bathroom" />
    ],
    description: (
      <div>
        <h1>Standard rooms</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vestibulum tincidunt eu erat sit amet mollis. Phasellus ut
          consectetur tortor. Aliquam auctor eros vel sapien cursus finibus
          eget a purus. Pellentesque luctus dui eget magna consequat cursus.
          Vestibulum accumsan eu sem vitae mollis. Donec in odio convallis
          elit feugiat laoreet eget ut quam. Ut ultricies erat quis gravida
          cursus. Ut imperdiet tempus leo, et ultricies erat rutrum et. In
          quis orci eu eros lacinia accumsan. Donec vel volutpat quam, eget
          imperdiet sapien. Morbi in euismod neque. Curabitur id turpis nec
          nunc rutrum sagittis vitae vel odio. Aenean congue, mi vel
          malesuada finibus, libero libero pharetra ex, in sodales ligula
          elit dapibus augue. Sed id est nibh. Nullam nunc nulla, luctus eu
          tempor id, sagittis non lacus.
        </p>
      </div>
    )
  },
  {
    shortLabel: 'Deluxe',
    label: 'Deluxe Rooms',
    images: [
      <img key="deluxe1" src="images/serene/deluxe1.png" aria-label="Deluxe room wide-angle" />,
      <img key="deluxe2" src="images/serene/deluxe2.png" aria-label="Deluxe room at night with view of city" />,
      <img key="deluxe3" src="images/serene/deluxe3.png" aria-label="Deluxe bathroom at night" />,
      <img key="deluxe4" src="images/serene/deluxe4.png" aria-label="Deluxe bathroom sink" />
    ],
    description: (
      <div>
        <h1>Deluxe rooms</h1>
        <p>
          Nunc venenatis congue est vitae cursus. Suspendisse porta, augue
          nec interdum feugiat, lorem erat consequat dolor, eu bibendum
          magna tellus non lacus. Aliquam nulla ipsum, pharetra sed lectus
          vitae, ornare vulputate sem. Nunc a justo massa. Nulla et urna
          eget sem eleifend fringilla nec non nibh. Suspendisse potenti. Sed
          non dapibus augue, imperdiet facilisis magna. Donec laoreet urna
          massa, congue consectetur nunc imperdiet sit amet. Etiam eu purus
          augue. Pellentesque vel ipsum gravida lectus aliquam aliquam. Sed
          in diam et est egestas sodales. Nunc semper purus ut eros
          fermentum mollis. Proin quam erat, scelerisque vitae mattis sed,
          dapibus nec nisl. Ut vel scelerisque lectus. Aenean diam tortor,
          molestie vel velit eu, semper viverra lacus.
        </p>
      </div>
    )
  },
  {
    shortLabel: 'Suites',
    label: 'Suites',
    images: [
      <img key="suite1" src="images/serene/suite1.jpg" aria-label="Suite sitting area" />,
      <img key="suite2" src="images/serene/suite2.jpg" aria-label="Suite bedroom area at night" />,
      <img key="suite3" src="images/serene/suite3.jpg" aria-label="Suite bathroom at night" />,
      <img key="suite4" src="images/serene/suite4.jpg" aria-label="Suite bathroom with view of city" />
    ],
    description: (
      <div>
        <h1>Suites</h1>
        <p>
          Quisque molestie posuere ligula at laoreet. Sed nisi est, semper a
          suscipit sit amet, porta ultricies enim. Vivamus a arcu nec arcu
          porttitor gravida eget nec odio. Sed porttitor rutrum turpis, ut
          egestas arcu sagittis condimentum. Integer consequat eros sed
          porttitor ullamcorper. Aliquam elementum vehicula arcu, at
          vulputate mi congue sed. Cras sed nunc ac enim vulputate gravida
          at non nulla. Aenean varius, turpis ac dapibus lacinia, nisl elit
          pretium diam, sit amet ornare magna nibh id diam. Aenean accumsan
          dolor quis massa tristique commodo.
        </p>
      </div>
    )
  }
];

const images = rooms.reduce((list, room) => list.concat(room.images), []);

const descriptions = rooms.map(room => (
  <div key={room.label}>
    {room.description}
  </div>
));


const Base =
  DesktopMixin(
    React.Component
  );

export default class SerenePage extends Base {

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      swipeFraction: null
    };
    this.roomIndexChanged = this.roomIndexChanged.bind(this);
    this.selectedIndexChanged = this.selectedIndexChanged.bind(this);
    this.swipeFractionChanged = this.swipeFractionChanged.bind(this);
  }

  render() {

    const roomIndex = roomIndexForImageIndex(this.state.selectedIndex);
    const room = rooms[roomIndex];
    const roomPosition = this.state.selectedIndex % 4;
    const roomFraction = roomPosition === 0 || roomPosition === 3 ? this.state.swipeFraction : 0;

    const standardRoomTabLabel = this.state.desktop ? 'Standard rooms' : 'Standard';
    const deluxeRoomTabLabel = this.state.desktop ? 'Deluxe rooms' : 'Deluxe';

    return (
      <div>
        <SereneTabStrip
          onSelectedIndexChanged={this.roomIndexChanged}
          selectedIndex={roomIndex}
          >
          <SereneTabButton>{standardRoomTabLabel}</SereneTabButton>
          <SereneTabButton>{deluxeRoomTabLabel}</SereneTabButton>
          <SereneTabButton>Suites</SereneTabButton>
        </SereneTabStrip>
        <SereneCarousel
          aria-label="Room photos"
          onSelectedIndexChanged={this.selectedIndexChanged}
          onSwipeFractionChanged={this.swipeFractionChanged}
          selectedIndex={this.state.selectedIndex}
          swipeFraction={this.state.swipeFraction}
          >
          {images}
        </SereneCarousel>
        <SereneModes
          selectedFraction={roomFraction}
          selectedIndex={roomIndex}
          >
          {descriptions}
        </SereneModes>
      </div>
    );
  }

  roomIndexChanged(roomIndex) {
    this.setState({
      selectedIndex: firstImageIndexForRoomIndex(roomIndex)
    });
  }

  selectedIndexChanged(selectedIndex) {
    this.setState({ selectedIndex });
  }

  swipeFractionChanged(swipeFraction) {
    this.setState({ swipeFraction });
  }

}


function roomIndexForImageIndex(imageIndex) {
  // For now, assume 4 images per room.
  return Math.floor(imageIndex / 4);
}

function firstImageIndexForRoomIndex(roomIndex) {
  return roomIndex * 4;
}
