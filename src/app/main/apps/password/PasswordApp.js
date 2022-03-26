import React from 'react';
import StrengthChecker from './StrengthChecker';

function PasswordApp() {
  return (
    <div className="grid sm:grid-cols-3 p-8">
      <div />
      <StrengthChecker />
      <div />
    </div>
  );
}

export default PasswordApp;
