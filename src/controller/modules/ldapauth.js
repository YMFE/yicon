import ldap from 'ldapjs';
import Q from 'q';

import config from '../../config';
import { simpleParse } from '../../helpers/utils';

function* ldapQuery(username, password) {
  const deferred = Q.defer();

  const { login } = config;

  const client = ldap.createClient({
    url: login.server,
  });

  client.once('error', (err) => {
    if (err) {
      deferred.reject(err);
    }
  });

  const ldapSearch = (err, search) => {
    const users = [];

    if (err) {
      deferred.reject(err);
    }

    search.on('searchEntry', (entry) => {
      if (entry) {
        users.push(entry.dn);
      }
    });

    search.on('error', (e) => {
      if (e) {
        deferred.resolve(false);
      }
    });

    // FIXME: do not reject when got searchReference
    // search.on('searchReference', (referral) => {
    //   if (referral) {
    //     deferred.reject(referral);
    //   }
    // });

    search.on('end', () => {
      if (users.length > 0) {
        client.bind(users[0], password, (e) => {
          if (e) {
            deferred.resolve(false);
          } else {
            deferred.resolve(true);
          }

          client.unbind();
        });
      } else {
        deferred.resolve(false);

        client.unbind();
      }
    });
  };

  client.bind([login.bindDn, login.baseDn].filter(Boolean).join(','), login.bindPassword, (err) => {
    if (err) {
      deferred.reject(err);
    }

    const searchDn = simpleParse([login.searchDn, login.baseDn].filter(Boolean).join(','), { username });
    const searchFilter = simpleParse(login.searchFilter || '(objectclass=*)', { username });

    const opts = {
      filter: searchFilter,
      scope: 'sub',
    };

    client.search(searchDn, opts, ldapSearch);
  });

  return deferred.promise;
}

export function* getLdapAuth(next) {
  const { username, password } = this.param;

  const isValid = yield ldapQuery(username, password);

  this.state.respond = { isValid };

  yield next;
}
