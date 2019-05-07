import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {authService} from "./services/auth.service"
import {authActions} from "./actions/auth.actions";
import {Route, Switch, withRouter} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import {history, routes} from "./utils";
import MainHeader from "./components/main-header";
import MainSidebar from "./components/main-sidebar";
import {settingsActions} from "./actions/settings.actions";
import PrivateRoute from "./components/private-route";

function App(props) {

    const {main_sidebar_close, isAuthenticated, location, page_title} = props

    useEffect(() => {

        const {dispatch} = props;
        dispatch(authActions.setLoggedIn(authService.isAuthenticated()))

        routes.map(route => {
            if (route.path === location.pathname)
                dispatch(settingsActions.setCurrentPageTitle(route.title))

            return route
        })

        history.listen((location, action) => {

            routes.map(route => {
                if (route.path === location.pathname)
                    dispatch(settingsActions.setCurrentPageTitle(route.title))

                return route
            })

        })
    }, [])


    return (
        <div className={"app-root" + (main_sidebar_close ? ' sidebar-close' : '')}>
            {isAuthenticated &&
            <React.Fragment>
                <MainHeader title={page_title}/>
                <MainSidebar/>
                <main className="main-content">
                    <Switch>
                        {routes.map((route, key) => {
                            if (route.private)
                                return <PrivateRoute {...route.data} path={route.path} key={key}
                                                     exact={route.exact}
                                                     component={route.component}/>;
                            else
                                return <Route path={route.path} key={key} exact={route.exact}
                                              component={route.component}/>;
                        })}
                    </Switch>
                </main>
            </React.Fragment>}

            {!isAuthenticated &&
            <Switch>
                {routes.map((route, key) => {
                    if (route.private)
                        return <PrivateRoute path={route.path} key={key} exact={route.exact}
                                             component={route.component}/>;
                    else
                        return <Route path={route.path} key={key} exact={route.exact}
                                      component={route.component}/>;
                })}
            </Switch>}
            <ToastContainer/>
        </div>
    );
}


function mapStateToProps(state) {

    return {
        isAuthenticated: state.auth.isAuthenticated,
        page_title: state.settings.page_title,
        main_sidebar_close: state.settings.main_sidebar_close
    }

}

export default connect(mapStateToProps)(withRouter(App));
