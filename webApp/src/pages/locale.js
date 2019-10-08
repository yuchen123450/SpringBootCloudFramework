import { Component } from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import defaultLocale from '../assets/locales/index.json';

class LocaleProvider extends Component {
    static instance = null;
    constructor(props) {
        super(props);
        if (!LocaleProvider.instance) {
            LocaleProvider.instance = this;
        }
    }

    render() {
        return this.props.children;
    }
}
export default injectIntl(LocaleProvider);

const intl = () => {
    let {
        instance: { props },
    } = LocaleProvider;
    return props.intl;
};
export const formatMessage = (...args) => intl().formatMessage(...args);

const initLocale = () => {
    let content = {};
    let locale = defaultLocale;
    for (let key in locale) {
        content[key] = {
            id: key,
            defaultMessage: locale[key],
        };
    }
    return defineMessages(content);
};
export const locale = initLocale();
