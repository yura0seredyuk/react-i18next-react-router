import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import {
  useTranslation,
  initReactI18next,
  withTranslation
} from "react-i18next";
import i18n from "i18next";
import {
  BrowserRouter,
  Route,
  Switch,
  withRouter,
  Redirect,
  Link
} from "react-router-dom";

import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const supportedLanguages = ["en", "fr"];

i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    whitelist: supportedLanguages,
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    detection: {
      order: ["path", "navigator"]
    }
  });

function HelloComp() {
  const { t } = useTranslation("common");
  return (
    <div>
      <h1>{t("hi")}</h1>
    </div>
  );
}

const Hello = withTranslation("common")(HelloComp);

function LanguageSwitcherComp(props) {
  const { children, i18n, t, history, match } = props;
  const changeLanguage = nextLang => {
    // const newUrl = localizeLink(routeName, match.params);
    const newUrl = `/${nextLang}/${t(match.params.page)}`;
    // debugger;
    console.log(newUrl);
    history.push(newUrl);
    i18n.changeLanguage(nextLang, () => {});
  };
  const handleClickSelectLanguage = (event, index) => {
    changeLanguage(supportedLanguages[index]);
  };
  return (
    <React.Fragment>
      {supportedLanguages.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={event => handleClickSelectLanguage(event, index)}
        >
          {option}
        </button>
      ))}
      <ul>
        <li>
          <Link to={`/${i18n.language}/${t("hello")}`}>{t("hello")}</Link>
        </li>
      </ul>
      {children}
    </React.Fragment>
  );
}

const LanguageSwitcher = withRouter(
  withTranslation("routes")(LanguageSwitcherComp)
);

function AppComp(props) {
  const { i18n, t } = props;
  console.log(`/${i18n.language}${t("/hello")}`);
  return (
    <BrowserRouter>
      <LanguageSwitcher />
      <Switch>
        <Route path={`/:lang(en|fr)${t("/hello")}`} component={Hello} />
        <Redirect to={`/${i18n.language}${t("/hello")}`} />
      </Switch>
    </BrowserRouter>
  );
}

const App = withTranslation("routes")(AppComp);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Suspense fallback="loading...">
    <App />
  </Suspense>,
  rootElement
);
