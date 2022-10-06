import React,{useState,useEffect} from 'react';
import { Link,useLocation,useParams } from 'react-router-dom';

// const api = new Service();

const Header = (props) => {

    return (
        <>
            <section> 
                <div className="container new-step-container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="col-wrap-table">
                                <div id="site-logo" className="site-logo col-media-left col-media-middle">
                                    <Link to="">
                                        <img className="logo-static" src="/assets/img/Fintranxect-Logo-1.png" alt="fintranxect1" />
                                    </Link>
                                </div>
                            </div>
                    </div>
                    </div>
                </div> 
            </section>
        </>
    )
}

export default Header;