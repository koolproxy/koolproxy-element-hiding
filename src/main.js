(function () {
  // Config

  var ruleFiles = ['//koolshare.b0.upaiyun.com/koolproxy/abp/easylistchina+easylist.txt']

  function load (url, success, error) {
    var request = new XMLHttpRequest()
    request.open('GET', url, true)

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        success(request.responseText)
      } else {
        error(request)
      }
    }

    request.onerror = error

    request.send()
  }

  function findSelectors (text) {
    var list = text.split('\n').filter(function (line) {
      if (!~line.indexOf('##')) return false

      line = line.split('##')
      var sites = line[0].split(',')
      if (sites[0] === '') return true

      var match = false
      for (var i = sites.length - 1; i >= 0; i--) {
        if (sites[i] === '~' + location.hostname) {
          break
          return false
        } else if (location.hostname.indexOf(sites[i]) >= 0) {
          match = true
        }
      }
      if (match) return true
    })
    var selectors = list.map(function (line) {
      return line.split('##')[1]
    })
    return selectors
  }

  ruleFiles.forEach(function (file) {
    load(file, function (res) {
      var allSelectors = findSelectors(res)
      var group = []
      for (var i = 0; i < allSelectors.length / 1000; i++) {
        group.push(allSelectors.slice( i * 1000, (i + 1) * 1000 ))
      }
      group.forEach(function (selectors) {
        var style = document.createElement('style')
        style.innerHTML = selectors.join(', ') + ' { display: none !important; }'
        document.head.insertBefore(style, null)
      })
    })
  })

})()
