import Enzyme from 'enzyme';
import jest from 'jest';
import Adapter from 'enzyme-adapter-react-16';
import './i18n';

Enzyme.configure({ adapter: new Adapter() });
