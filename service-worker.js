(()=>{"use strict";function e(e){const t="1.0.54-296387";return{log:function(n,...r){console.log(`[${e} ${t}] ${n}`,...r)},error:function(n,...r){console.error(`[${e} ${t}] ${n}`,...r)},warn:function(n,...r){console.warn(`[${e} ${t}] ${n}`,...r)},debug:function(n,...r){console.debug(`[${e} ${t}] ${n}`,...r)}}}const{log:t,error:n,warn:r,debug:c}=e("app"),a=[/tailwind/i],s="claptastic-store-1.0.54-296387",{error:i,debug:o,log:l,warn:u}=e("sw");l("loading service worker"),self.addEventListener("activate",(e=>{l("activating",e),e.waitUntil(caches.keys().then((e=>Promise.all(e.map((e=>{if(s!==e)return l("deleting cache",e),caches.delete(e)}))))))})),self.addEventListener("install",(e=>{l("installing"),self.skipWaiting()})),self.addEventListener("fetch",(e=>{const t=e.request.url;if(!1===t.toLowerCase().includes("/claptastic/"))return l("Bypassing fetch as url is not local"),!1;e.respondWith((async()=>{const n=await caches.open(s);let r;try{if(function(e){return a.some((t=>t.test(e)))}(t)){const r=await n.match(e.request);if(r)return l("returning immutable cached resource: "+t),r}if(o("fetching: "+t),r=await fetch(e.request),!r.ok)throw r;o(`updating cache: ${t}`),await n.put(e.request,r.clone())}catch(r){u(`Error fetching response. Last chance find a local cache version: ${t}`,r);const c=n.match(e.request);if(c)return c}return r})())}))})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jbGFwdGFzdGljLy4vc3JjL2xvZ2dlci5qcyIsIndlYnBhY2s6Ly9jbGFwdGFzdGljLy4vc3JjL3NlcnZpY2Utd29ya2VyLmpzIl0sIm5hbWVzIjpbImNyZWF0ZUxvZ2dlciIsInByZWZpeCIsInZlcnNpb24iLCJXRUJQQUNLX1ZFUlNJT04iLCJsb2ciLCJtc2ciLCJhcmdzIiwiY29uc29sZSIsImVycm9yIiwid2FybiIsImRlYnVnIiwiaW1tdXRhYmxlVXJscyIsImNhY2hlTmFtZSIsImxvZ2dlciIsInNlbGYiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsIndhaXRVbnRpbCIsImNhY2hlcyIsImtleXMiLCJ0aGVuIiwia2V5TGlzdCIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJrZXkiLCJkZWxldGUiLCJza2lwV2FpdGluZyIsImZldGNoRXZlbnQiLCJ1cmwiLCJyZXF1ZXN0IiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsInJlc3BvbmRXaXRoIiwiY2FjaGUiLCJvcGVuIiwiZmV0Y2hSZXNwb25zZSIsInNvbWUiLCJ4IiwidGVzdCIsImlzSW1tdXRhYmxlUmVzb3VyY2UiLCJjYWNoZWRSZXNwb25zZSIsIm1hdGNoIiwiZmV0Y2giLCJvayIsInB1dCIsImNsb25lIiwiZXJyIl0sIm1hcHBpbmdzIjoibUJBQWUsU0FBU0EsRUFBYUMsR0FDbkMsTUFBTUMsRUFBVUMsZ0JBaUJoQixNQUFPLENBQUVDLElBaEJULFNBQWFDLEtBQVFDLEdBQ25CQyxRQUFRSCxJQUFLLElBQUdILEtBQVVDLE1BQVlHLE9BQVVDLElBZXBDRSxNQVpkLFNBQWVILEtBQVFDLEdBQ3JCQyxRQUFRQyxNQUFPLElBQUdQLEtBQVVDLE1BQVlHLE9BQVVDLElBVy9CRyxLQVJyQixTQUFjSixLQUFRQyxHQUNwQkMsUUFBUUUsS0FBTSxJQUFHUixLQUFVQyxNQUFZRyxPQUFVQyxJQU94QkksTUFKM0IsU0FBZUwsS0FBUUMsR0FDckJDLFFBQVFHLE1BQU8sSUFBR1QsS0FBVUMsTUFBWUcsT0FBVUMsS0FNL0MsTUFBTSxJQUFFRixFQUFGLE1BQU9JLEVBQVAsS0FBY0MsRUFBZCxNQUFvQkMsR0FBVVYsRUFBYSxPQ2xCbERXLEVBQWdCLENBQUMsYUFFakJDLEVBQWEsa0NBR1hKLE1BQUYsRUFBU0UsTUFBVCxFQUFnQk4sSUFBaEIsRUFBcUJLLFFBQVNJLEVBQU8sTUFFM0NULEVBQUksMEJBTUpVLEtBQUtDLGlCQUFpQixZQUFhQyxJQUNqQ1osRUFBSSxhQUFjWSxHQUVsQkEsRUFBRUMsVUFDQUMsT0FBT0MsT0FBT0MsTUFBTUMsR0FDWEMsUUFBUUMsSUFDYkYsRUFBUUcsS0FBS0MsSUFDWCxHQUFJYixJQUFjYSxFQUVoQixPQURBckIsRUFBSSxpQkFBa0JxQixHQUNmUCxPQUFPUSxPQUFPRCxhQVFqQ1gsS0FBS0MsaUJBQWlCLFdBQVlDLElBQ2hDWixFQUFJLGNBQ0pVLEtBQUthLGlCQVFQYixLQUFLQyxpQkFBaUIsU0FBVWEsSUFDOUIsTUFBTUMsRUFBTUQsRUFBV0UsUUFBUUQsSUFDL0IsSUFBbUQsSUFBL0NBLEVBQUlFLGNBQWNDLFNBQVMsZ0JBRTdCLE9BREE1QixFQUFJLHdDQUNHLEVBRVR3QixFQUFXSyxZQUNULFdBQ0UsTUFBTUMsUUFBY2hCLE9BQU9pQixLQUFLdkIsR0FDaEMsSUFBSXdCLEVBRUosSUFDRSxHQTNDUixTQUE2QlAsR0FDM0IsT0FBT2xCLEVBQWMwQixNQUFNQyxHQUFNQSxFQUFFQyxLQUFLVixLQTBDOUJXLENBQW9CWCxHQUFNLENBQzVCLE1BQU1ZLFFBQXVCUCxFQUFNUSxNQUFNZCxFQUFXRSxTQUNwRCxHQUFJVyxFQUVGLE9BREFyQyxFQUFJLHdDQUEwQ3lCLEdBQ3ZDWSxFQUtYLEdBRkEvQixFQUFNLGFBQWVtQixHQUNyQk8sUUFBc0JPLE1BQU1mLEVBQVdFLFVBQ2xDTSxFQUFjUSxHQUNqQixNQUFNUixFQUVSMUIsRUFBTyxtQkFBa0JtQixXQUNuQkssRUFBTVcsSUFBSWpCLEVBQVdFLFFBQVNNLEVBQWNVLFNBQ2xELE1BQU9DLEdBQ1B0QyxFQUNHLG9FQUFtRW9CLElBQ3BFa0IsR0FFRixNQUFNTixFQUFpQlAsRUFBTVEsTUFBTWQsRUFBV0UsU0FDOUMsR0FBSVcsRUFBZ0IsT0FBT0EsRUFHN0IsT0FBT0wsR0E1QlQsUSIsImZpbGUiOiJzZXJ2aWNlLXdvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUxvZ2dlcihwcmVmaXgpIHtcbiAgY29uc3QgdmVyc2lvbiA9IFdFQlBBQ0tfVkVSU0lPTjtcbiAgZnVuY3Rpb24gbG9nKG1zZywgLi4uYXJncykge1xuICAgIGNvbnNvbGUubG9nKGBbJHtwcmVmaXh9ICR7dmVyc2lvbn1dICR7bXNnfWAsIC4uLmFyZ3MpO1xuICB9XG5cbiAgZnVuY3Rpb24gZXJyb3IobXNnLCAuLi5hcmdzKSB7XG4gICAgY29uc29sZS5lcnJvcihgWyR7cHJlZml4fSAke3ZlcnNpb259XSAke21zZ31gLCAuLi5hcmdzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdhcm4obXNnLCAuLi5hcmdzKSB7XG4gICAgY29uc29sZS53YXJuKGBbJHtwcmVmaXh9ICR7dmVyc2lvbn1dICR7bXNnfWAsIC4uLmFyZ3MpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVidWcobXNnLCAuLi5hcmdzKSB7XG4gICAgY29uc29sZS5kZWJ1ZyhgWyR7cHJlZml4fSAke3ZlcnNpb259XSAke21zZ31gLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHJldHVybiB7IGxvZywgZXJyb3IsIHdhcm4sIGRlYnVnIH07XG59XG5cbmV4cG9ydCBjb25zdCB7IGxvZywgZXJyb3IsIHdhcm4sIGRlYnVnIH0gPSBjcmVhdGVMb2dnZXIoXCJhcHBcIik7XG4iLCJjb25zdCB2ZXJzaW9uID0gV0VCUEFDS19WRVJTSU9OO1xuXG5jb25zdCBhcHBrZXkgPSBcImNsYXB0YXN0aWNcIjtcbmNvbnN0IGltbXV0YWJsZVVybHMgPSBbL3RhaWx3aW5kL2ldO1xuXG5jb25zdCBjYWNoZU5hbWUgPSBgJHthcHBrZXl9LXN0b3JlLSR7dmVyc2lvbn1gO1xuXG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiO1xuY29uc3QgeyBlcnJvciwgZGVidWcsIGxvZywgd2FybiB9ID0gbG9nZ2VyKFwic3dcIik7XG5cbmxvZyhcImxvYWRpbmcgc2VydmljZSB3b3JrZXJcIik7XG5cbmZ1bmN0aW9uIGlzSW1tdXRhYmxlUmVzb3VyY2UodXJsKSB7XG4gIHJldHVybiBpbW11dGFibGVVcmxzLnNvbWUoKHgpID0+IHgudGVzdCh1cmwpKTtcbn1cblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKFwiYWN0aXZhdGVcIiwgKGUpID0+IHtcbiAgbG9nKFwiYWN0aXZhdGluZ1wiLCBlKTtcblxuICBlLndhaXRVbnRpbChcbiAgICBjYWNoZXMua2V5cygpLnRoZW4oKGtleUxpc3QpID0+IHtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAga2V5TGlzdC5tYXAoKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChjYWNoZU5hbWUgIT09IGtleSkge1xuICAgICAgICAgICAgbG9nKFwiZGVsZXRpbmcgY2FjaGVcIiwga2V5KTtcbiAgICAgICAgICAgIHJldHVybiBjYWNoZXMuZGVsZXRlKGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KVxuICApO1xufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImluc3RhbGxcIiwgKGUpID0+IHtcbiAgbG9nKFwiaW5zdGFsbGluZ1wiKTtcbiAgc2VsZi5za2lwV2FpdGluZygpO1xuICAvLyBsb2coXCJpbnN0YWxsaW5nXCIsIGZpbGVzVG9DYWNoZSk7XG4gIC8vIGUud2FpdFVudGlsKFxuICAvLyAgIGNhY2hlcy5vcGVuKGNhY2hlTmFtZSkudGhlbigoY2FjaGUpID0+IGNhY2hlLmFkZEFsbChmaWxlc1RvQ2FjaGUpKVxuICAvLyApO1xufSk7XG5cbi8vIEZldGNoaW5nIGNvbnRlbnQgdXNpbmcgU2VydmljZSBXb3JrZXJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImZldGNoXCIsIChmZXRjaEV2ZW50KSA9PiB7XG4gIGNvbnN0IHVybCA9IGZldGNoRXZlbnQucmVxdWVzdC51cmw7XG4gIGlmICh1cmwudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhcIi9jbGFwdGFzdGljL1wiKSA9PT0gZmFsc2UpIHtcbiAgICBsb2coXCJCeXBhc3NpbmcgZmV0Y2ggYXMgdXJsIGlzIG5vdCBsb2NhbFwiKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZmV0Y2hFdmVudC5yZXNwb25kV2l0aChcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY2FjaGUgPSBhd2FpdCBjYWNoZXMub3BlbihjYWNoZU5hbWUpO1xuICAgICAgbGV0IGZldGNoUmVzcG9uc2U7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChpc0ltbXV0YWJsZVJlc291cmNlKHVybCkpIHtcbiAgICAgICAgICBjb25zdCBjYWNoZWRSZXNwb25zZSA9IGF3YWl0IGNhY2hlLm1hdGNoKGZldGNoRXZlbnQucmVxdWVzdCk7XG4gICAgICAgICAgaWYgKGNhY2hlZFJlc3BvbnNlKSB7XG4gICAgICAgICAgICBsb2coXCJyZXR1cm5pbmcgaW1tdXRhYmxlIGNhY2hlZCByZXNvdXJjZTogXCIgKyB1cmwpO1xuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFJlc3BvbnNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkZWJ1ZyhcImZldGNoaW5nOiBcIiArIHVybCk7XG4gICAgICAgIGZldGNoUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChmZXRjaEV2ZW50LnJlcXVlc3QpO1xuICAgICAgICBpZiAoIWZldGNoUmVzcG9uc2Uub2spIHtcbiAgICAgICAgICB0aHJvdyBmZXRjaFJlc3BvbnNlO1xuICAgICAgICB9XG4gICAgICAgIGRlYnVnKGB1cGRhdGluZyBjYWNoZTogJHt1cmx9YCk7XG4gICAgICAgIGF3YWl0IGNhY2hlLnB1dChmZXRjaEV2ZW50LnJlcXVlc3QsIGZldGNoUmVzcG9uc2UuY2xvbmUoKSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgd2FybihcbiAgICAgICAgICBgRXJyb3IgZmV0Y2hpbmcgcmVzcG9uc2UuIExhc3QgY2hhbmNlIGZpbmQgYSBsb2NhbCBjYWNoZSB2ZXJzaW9uOiAke3VybH1gLFxuICAgICAgICAgIGVyclxuICAgICAgICApO1xuICAgICAgICBjb25zdCBjYWNoZWRSZXNwb25zZSA9IGNhY2hlLm1hdGNoKGZldGNoRXZlbnQucmVxdWVzdCk7XG4gICAgICAgIGlmIChjYWNoZWRSZXNwb25zZSkgcmV0dXJuIGNhY2hlZFJlc3BvbnNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmV0Y2hSZXNwb25zZTtcbiAgICB9KSgpXG4gICk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=