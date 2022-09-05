import React from 'react';

import Header from '../../components/header/header';
import PageNotFound from '../../components/emptystate/pagenotfound';
import ConnectionLost from '../../components/emptystate/connectionlost';

const ErrorScreen = () => {
  return(
    <div>
      <Header/>
      {/* <PageNotFound/> */}
      <ConnectionLost/>
    </div>
  );
};

export default ErrorScreen;
