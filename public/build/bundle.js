
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if (typeof $$scope.dirty === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function add_resize_listener(element, fn) {
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        const object = document.createElement('object');
        object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        object.setAttribute('aria-hidden', 'true');
        object.type = 'text/html';
        object.tabIndex = -1;
        let win;
        object.onload = () => {
            win = object.contentDocument.defaultView;
            win.addEventListener('resize', fn);
        };
        if (/Trident/.test(navigator.userAgent)) {
            element.appendChild(object);
            object.data = 'about:blank';
        }
        else {
            object.data = 'about:blank';
            element.appendChild(object);
        }
        return {
            cancel: () => {
                win && win.removeEventListener && win.removeEventListener('resize', fn);
                element.removeChild(object);
            }
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css = "html, body {\n  padding: 0px !important;\n  margin: 0px !important;\n  overflow: hidden;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen-Sans, Ubuntu, Cantarell, \"Helvetica Neue\", sans-serif;\n}\n\n* {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  cursor: default;\n}\n* ::selection {\n  background: var(--text-selection) !important;\n  /* WebKit/Blink Browsers */\n}\n* ::-moz-selection {\n  background: var(--text-selection) !important;\n  /* Gecko Browsers */\n}\n\n::-moz-focus-inner {\n  border: 0;\n}";
    styleInject(css);

    /* src/editor/E_Button.svelte generated by Svelte v3.16.7 */

    const file = "src/editor/E_Button.svelte";

    function create_fragment(ctx) {
    	let button;
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*name*/ ctx[1]);
    			attr_dev(button, "class", "svelte-1tu5bq4");
    			toggle_class(button, "flat", /*flat*/ ctx[0]);
    			add_location(button, file, 7, 0, 110);
    			dispose = listen_dev(button, "click", /*onclick*/ ctx[2], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 2) set_data_dev(t, /*name*/ ctx[1]);

    			if (dirty & /*flat*/ 1) {
    				toggle_class(button, "flat", /*flat*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { flat = false } = $$props;
    	let { name = "button" } = $$props;
    	let { onclick } = $$props;
    	const writable_props = ["flat", "name", "onclick"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<E_Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("flat" in $$props) $$invalidate(0, flat = $$props.flat);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("onclick" in $$props) $$invalidate(2, onclick = $$props.onclick);
    	};

    	$$self.$capture_state = () => {
    		return { flat, name, onclick };
    	};

    	$$self.$inject_state = $$props => {
    		if ("flat" in $$props) $$invalidate(0, flat = $$props.flat);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("onclick" in $$props) $$invalidate(2, onclick = $$props.onclick);
    	};

    	return [flat, name, onclick];
    }

    class E_Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { flat: 0, name: 1, onclick: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "E_Button",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*onclick*/ ctx[2] === undefined && !("onclick" in props)) {
    			console.warn("<E_Button> was created without expected prop 'onclick'");
    		}
    	}

    	get flat() {
    		throw new Error("<E_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flat(value) {
    		throw new Error("<E_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<E_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<E_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onclick() {
    		throw new Error("<E_Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onclick(value) {
    		throw new Error("<E_Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/editor/E_App_Nav.svelte generated by Svelte v3.16.7 */
    const file$1 = "src/editor/E_App_Nav.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (9:1) {#each entrys as item}
    function create_each_block(ctx) {
    	let current;

    	const e_button = new E_Button({
    			props: { flat: true, name: /*item*/ ctx[1].lable },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(e_button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(e_button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const e_button_changes = {};
    			if (dirty & /*entrys*/ 1) e_button_changes.name = /*item*/ ctx[1].lable;
    			e_button.$set(e_button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(e_button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(e_button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(e_button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(9:1) {#each entrys as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	let each_value = /*entrys*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "app_nav svelte-1be8890");
    			add_location(div, file$1, 7, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*entrys*/ 1) {
    				each_value = /*entrys*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { entrys } = $$props;
    	const writable_props = ["entrys"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<E_App_Nav> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("entrys" in $$props) $$invalidate(0, entrys = $$props.entrys);
    	};

    	$$self.$capture_state = () => {
    		return { entrys };
    	};

    	$$self.$inject_state = $$props => {
    		if ("entrys" in $$props) $$invalidate(0, entrys = $$props.entrys);
    	};

    	return [entrys];
    }

    class E_App_Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { entrys: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "E_App_Nav",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*entrys*/ ctx[0] === undefined && !("entrys" in props)) {
    			console.warn("<E_App_Nav> was created without expected prop 'entrys'");
    		}
    	}

    	get entrys() {
    		throw new Error("<E_App_Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entrys(value) {
    		throw new Error("<E_App_Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/editor/E_Dock.svelte generated by Svelte v3.16.7 */

    const file$2 = "src/editor/E_Dock.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let h1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "DOCK TABS HERE.";
    			attr_dev(h1, "class", "svelte-n1an55");
    			add_location(h1, file$2, 5, 4, 42);
    			attr_dev(div, "class", "dock svelte-n1an55");
    			add_location(div, file$2, 4, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class E_Dock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "E_Dock",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    function clamp(num, min, max) {
        return num < min ? min : num > max ? max : num;
    }

    /* src/editor/E_Splitter.svelte generated by Svelte v3.16.7 */
    const file$3 = "src/editor/E_Splitter.svelte";
    const get_b_slot_changes = dirty => ({});
    const get_b_slot_context = ctx => ({});
    const get_a_slot_changes = dirty => ({});
    const get_a_slot_context = ctx => ({});

    // (163:1) {#if !fixed}
    function create_if_block_1(ctx) {
    	let div;
    	let div_class_value;
    	let div_style_value;
    	let drag_action;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "" + (/*type*/ ctx[1] + " divider" + " svelte-1btpbtt"));
    			attr_dev(div, "style", div_style_value = "" + (/*side*/ ctx[7] + ": calc(" + /*pos*/ ctx[0] + "% - 8px)"));
    			add_location(div, file$3, 163, 2, 2789);
    			dispose = action_destroyer(drag_action = /*drag*/ ctx[10].call(null, div, /*setPos*/ ctx[9]));
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*type*/ 2 && div_class_value !== (div_class_value = "" + (/*type*/ ctx[1] + " divider" + " svelte-1btpbtt"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*side, pos*/ 129 && div_style_value !== (div_style_value = "" + (/*side*/ ctx[7] + ": calc(" + /*pos*/ ctx[0] + "% - 8px)"))) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(163:1) {#if !fixed}",
    		ctx
    	});

    	return block;
    }

    // (168:0) {#if dragging}
    function create_if_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "mousecatcher svelte-1btpbtt");
    			add_location(div, file$3, 168, 1, 2908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(168:0) {#if dragging}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div2;
    	let div0;
    	let div0_style_value;
    	let t0;
    	let div1;
    	let div1_style_value;
    	let t1;
    	let div2_resize_listener;
    	let t2;
    	let if_block1_anchor;
    	let current;
    	const a_slot_template = /*$$slots*/ ctx[17].a;
    	const a_slot = create_slot(a_slot_template, ctx, /*$$scope*/ ctx[16], get_a_slot_context);
    	const b_slot_template = /*$$slots*/ ctx[17].b;
    	const b_slot = create_slot(b_slot_template, ctx, /*$$scope*/ ctx[16], get_b_slot_context);
    	let if_block0 = !/*fixed*/ ctx[2] && create_if_block_1(ctx);
    	let if_block1 = /*dragging*/ ctx[6] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (a_slot) a_slot.c();
    			t0 = space();
    			div1 = element("div");
    			if (b_slot) b_slot.c();
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(div0, "class", "pane svelte-1btpbtt");
    			attr_dev(div0, "style", div0_style_value = "" + (/*dimension*/ ctx[8] + ": " + /*pos*/ ctx[0] + "%;"));
    			add_location(div0, file$3, 154, 1, 2600);
    			attr_dev(div1, "class", "pane svelte-1btpbtt");
    			attr_dev(div1, "style", div1_style_value = "" + (/*dimension*/ ctx[8] + ": " + (100 - /*pos*/ ctx[0]) + "%;"));
    			add_location(div1, file$3, 158, 1, 2683);
    			attr_dev(div2, "class", "container svelte-1btpbtt");
    			add_render_callback(() => /*div2_elementresize_handler*/ ctx[19].call(div2));
    			add_location(div2, file$3, 153, 0, 2505);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			if (a_slot) {
    				a_slot.m(div0, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);

    			if (b_slot) {
    				b_slot.m(div1, null);
    			}

    			append_dev(div2, t1);
    			if (if_block0) if_block0.m(div2, null);
    			/*div2_binding*/ ctx[18](div2);
    			div2_resize_listener = add_resize_listener(div2, /*div2_elementresize_handler*/ ctx[19].bind(div2));
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (a_slot && a_slot.p && dirty & /*$$scope*/ 65536) {
    				a_slot.p(get_slot_context(a_slot_template, ctx, /*$$scope*/ ctx[16], get_a_slot_context), get_slot_changes(a_slot_template, /*$$scope*/ ctx[16], dirty, get_a_slot_changes));
    			}

    			if (!current || dirty & /*dimension, pos*/ 257 && div0_style_value !== (div0_style_value = "" + (/*dimension*/ ctx[8] + ": " + /*pos*/ ctx[0] + "%;"))) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (b_slot && b_slot.p && dirty & /*$$scope*/ 65536) {
    				b_slot.p(get_slot_context(b_slot_template, ctx, /*$$scope*/ ctx[16], get_b_slot_context), get_slot_changes(b_slot_template, /*$$scope*/ ctx[16], dirty, get_b_slot_changes));
    			}

    			if (!current || dirty & /*dimension, pos*/ 257 && div1_style_value !== (div1_style_value = "" + (/*dimension*/ ctx[8] + ": " + (100 - /*pos*/ ctx[0]) + "%;"))) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (!/*fixed*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*dragging*/ ctx[6]) {
    				if (!if_block1) {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(a_slot, local);
    			transition_in(b_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(a_slot, local);
    			transition_out(b_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (a_slot) a_slot.d(detaching);
    			if (b_slot) b_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			/*div2_binding*/ ctx[18](null);
    			div2_resize_listener.cancel();
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { type = "columns" } = $$props;
    	let { pos = 50 } = $$props;
    	let { fixed = false } = $$props;
    	let { buffer = 40 } = $$props;
    	let { min } = $$props;
    	let { max } = $$props;
    	let w;
    	let h;
    	const refs = {};
    	let dragging = false;

    	function setPos(event) {
    		const { top, left } = refs.container.getBoundingClientRect();

    		const px = type === "vertical"
    		? event.clientY - top
    		: event.clientX - left;

    		$$invalidate(0, pos = 100 * px / size);
    		dispatch("change");
    	}

    	function drag(node, callback) {
    		const mousedown = event => {
    			if (event.which !== 1) return;
    			event.preventDefault();
    			$$invalidate(6, dragging = true);

    			const onmouseup = () => {
    				$$invalidate(6, dragging = false);
    				window.removeEventListener("mousemove", callback, false);
    				window.removeEventListener("mouseup", onmouseup, false);
    			};

    			window.addEventListener("mousemove", callback, false);
    			window.addEventListener("mouseup", onmouseup, false);
    		};

    		node.addEventListener("mousedown", mousedown, false);

    		return {
    			destroy() {
    				node.removeEventListener("mousedown", onmousedown, false);
    			}
    		};
    	}

    	const writable_props = ["type", "pos", "fixed", "buffer", "min", "max"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<E_Splitter> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			refs.container = $$value;
    			$$invalidate(5, refs);
    		});
    	}

    	function div2_elementresize_handler() {
    		w = this.clientWidth;
    		h = this.clientHeight;
    		$$invalidate(3, w);
    		$$invalidate(4, h);
    	}

    	$$self.$set = $$props => {
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("pos" in $$props) $$invalidate(0, pos = $$props.pos);
    		if ("fixed" in $$props) $$invalidate(2, fixed = $$props.fixed);
    		if ("buffer" in $$props) $$invalidate(13, buffer = $$props.buffer);
    		if ("min" in $$props) $$invalidate(11, min = $$props.min);
    		if ("max" in $$props) $$invalidate(12, max = $$props.max);
    		if ("$$scope" in $$props) $$invalidate(16, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {
    			type,
    			pos,
    			fixed,
    			buffer,
    			min,
    			max,
    			w,
    			h,
    			dragging,
    			size,
    			side,
    			dimension
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("pos" in $$props) $$invalidate(0, pos = $$props.pos);
    		if ("fixed" in $$props) $$invalidate(2, fixed = $$props.fixed);
    		if ("buffer" in $$props) $$invalidate(13, buffer = $$props.buffer);
    		if ("min" in $$props) $$invalidate(11, min = $$props.min);
    		if ("max" in $$props) $$invalidate(12, max = $$props.max);
    		if ("w" in $$props) $$invalidate(3, w = $$props.w);
    		if ("h" in $$props) $$invalidate(4, h = $$props.h);
    		if ("dragging" in $$props) $$invalidate(6, dragging = $$props.dragging);
    		if ("size" in $$props) $$invalidate(14, size = $$props.size);
    		if ("side" in $$props) $$invalidate(7, side = $$props.side);
    		if ("dimension" in $$props) $$invalidate(8, dimension = $$props.dimension);
    	};

    	let size;
    	let side;
    	let dimension;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*type, h, w*/ 26) {
    			 $$invalidate(14, size = type === "vertical" ? h : w);
    		}

    		if ($$self.$$.dirty & /*buffer, size*/ 24576) {
    			 $$invalidate(11, min = 100 * (buffer / size));
    		}

    		if ($$self.$$.dirty & /*min*/ 2048) {
    			 $$invalidate(12, max = 100 - min);
    		}

    		if ($$self.$$.dirty & /*pos, min, max*/ 6145) {
    			 $$invalidate(0, pos = clamp(pos, min, max));
    		}

    		if ($$self.$$.dirty & /*type*/ 2) {
    			 $$invalidate(7, side = type === "horizontal" ? "left" : "top");
    		}

    		if ($$self.$$.dirty & /*type*/ 2) {
    			 $$invalidate(8, dimension = type === "horizontal" ? "width" : "height");
    		}
    	};

    	return [
    		pos,
    		type,
    		fixed,
    		w,
    		h,
    		refs,
    		dragging,
    		side,
    		dimension,
    		setPos,
    		drag,
    		min,
    		max,
    		buffer,
    		size,
    		dispatch,
    		$$scope,
    		$$slots,
    		div2_binding,
    		div2_elementresize_handler
    	];
    }

    class E_Splitter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$3, safe_not_equal, {
    			type: 1,
    			pos: 0,
    			fixed: 2,
    			buffer: 13,
    			min: 11,
    			max: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "E_Splitter",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*min*/ ctx[11] === undefined && !("min" in props)) {
    			console.warn("<E_Splitter> was created without expected prop 'min'");
    		}

    		if (/*max*/ ctx[12] === undefined && !("max" in props)) {
    			console.warn("<E_Splitter> was created without expected prop 'max'");
    		}
    	}

    	get type() {
    		throw new Error("<E_Splitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<E_Splitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pos() {
    		throw new Error("<E_Splitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pos(value) {
    		throw new Error("<E_Splitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixed() {
    		throw new Error("<E_Splitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<E_Splitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buffer() {
    		throw new Error("<E_Splitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buffer(value) {
    		throw new Error("<E_Splitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<E_Splitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<E_Splitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<E_Splitter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<E_Splitter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.7 */
    const file$4 = "src/App.svelte";

    // (33:2) <section slot=a>
    function create_a_slot_1(ctx) {
    	let section;
    	let current;
    	const e_dock = new E_Dock({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(e_dock.$$.fragment);
    			attr_dev(section, "slot", "a");
    			add_location(section, file$4, 32, 2, 767);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(e_dock, section, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(e_dock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(e_dock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(e_dock);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_a_slot_1.name,
    		type: "slot",
    		source: "(33:2) <section slot=a>",
    		ctx
    	});

    	return block;
    }

    // (43:5) <section slot=a>
    function create_a_slot(ctx) {
    	let section;
    	let current;
    	const e_dock = new E_Dock({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(e_dock.$$.fragment);
    			attr_dev(section, "slot", "a");
    			add_location(section, file$4, 42, 5, 1017);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(e_dock, section, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(e_dock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(e_dock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(e_dock);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_a_slot.name,
    		type: "slot",
    		source: "(43:5) <section slot=a>",
    		ctx
    	});

    	return block;
    }

    // (47:5) <section slot=b style='height: 100%;'>
    function create_b_slot_1(ctx) {
    	let section;
    	let current;
    	const e_dock = new E_Dock({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(e_dock.$$.fragment);
    			attr_dev(section, "slot", "b");
    			set_style(section, "height", "100%");
    			add_location(section, file$4, 46, 5, 1073);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(e_dock, section, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(e_dock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(e_dock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(e_dock);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_b_slot_1.name,
    		type: "slot",
    		source: "(47:5) <section slot=b style='height: 100%;'>",
    		ctx
    	});

    	return block;
    }

    // (38:4) <SplitPane      type="{'rows' === 'rows' ? 'vertical' : 'horizontal'}"      pos="{fixed ? fixedPos : orientation === 'rows' ? 50 : 60}"      {fixed}     >
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(38:4) <SplitPane      type=\\\"{'rows' === 'rows' ? 'vertical' : 'horizontal'}\\\"      pos=\\\"{fixed ? fixedPos : orientation === 'rows' ? 50 : 60}\\\"      {fixed}     >",
    		ctx
    	});

    	return block;
    }

    // (37:2) <section slot=b style='height: 100%;'>
    function create_b_slot(ctx) {
    	let section;
    	let current;

    	const splitpane = new E_Splitter({
    			props: {
    				type:  "vertical" ,
    				pos: /*fixed*/ ctx[0]
    				? /*fixedPos*/ ctx[1]
    				: /*orientation*/ ctx[2] === "rows" ? 50 : 60,
    				fixed: /*fixed*/ ctx[0],
    				$$slots: {
    					default: [create_default_slot_1],
    					b: [create_b_slot_1],
    					a: [create_a_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(splitpane.$$.fragment);
    			attr_dev(section, "slot", "b");
    			set_style(section, "height", "100%");
    			add_location(section, file$4, 36, 2, 814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(splitpane, section, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const splitpane_changes = {};

    			if (dirty & /*fixed, fixedPos, orientation*/ 7) splitpane_changes.pos = /*fixed*/ ctx[0]
    			? /*fixedPos*/ ctx[1]
    			: /*orientation*/ ctx[2] === "rows" ? 50 : 60;

    			if (dirty & /*fixed*/ 1) splitpane_changes.fixed = /*fixed*/ ctx[0];

    			if (dirty & /*$$scope*/ 32) {
    				splitpane_changes.$$scope = { dirty, ctx };
    			}

    			splitpane.$set(splitpane_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(splitpane.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(splitpane.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(splitpane);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_b_slot.name,
    		type: "slot",
    		source: "(37:2) <section slot=b style='height: 100%;'>",
    		ctx
    	});

    	return block;
    }

    // (28:1) <SplitPane   type="{orientation === 'rows' ? 'vertical' : 'horizontal'}"   pos="{fixed ? fixedPos : orientation === 'rows' ? 50 : 60}"   {fixed}  >
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(28:1) <SplitPane   type=\\\"{orientation === 'rows' ? 'vertical' : 'horizontal'}\\\"   pos=\\\"{fixed ? fixedPos : orientation === 'rows' ? 50 : 60}\\\"   {fixed}  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let t;
    	let current;

    	const e_app_nav = new E_App_Nav({
    			props: { entrys: /*filemenu*/ ctx[3] },
    			$$inline: true
    		});

    	const splitpane = new E_Splitter({
    			props: {
    				type: /*orientation*/ ctx[2] === "rows"
    				? "vertical"
    				: "horizontal",
    				pos: /*fixed*/ ctx[0]
    				? /*fixedPos*/ ctx[1]
    				: /*orientation*/ ctx[2] === "rows" ? 50 : 60,
    				fixed: /*fixed*/ ctx[0],
    				$$slots: {
    					default: [create_default_slot],
    					b: [create_b_slot],
    					a: [create_a_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(e_app_nav.$$.fragment);
    			t = space();
    			create_component(splitpane.$$.fragment);
    			attr_dev(div, "class", "editor-frame svelte-16h0zr9");
    			add_location(div, file$4, 24, 0, 555);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(e_app_nav, div, null);
    			append_dev(div, t);
    			mount_component(splitpane, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const splitpane_changes = {};

    			if (dirty & /*orientation*/ 4) splitpane_changes.type = /*orientation*/ ctx[2] === "rows"
    			? "vertical"
    			: "horizontal";

    			if (dirty & /*fixed, fixedPos, orientation*/ 7) splitpane_changes.pos = /*fixed*/ ctx[0]
    			? /*fixedPos*/ ctx[1]
    			: /*orientation*/ ctx[2] === "rows" ? 50 : 60;

    			if (dirty & /*fixed*/ 1) splitpane_changes.fixed = /*fixed*/ ctx[0];

    			if (dirty & /*$$scope, fixed, fixedPos, orientation*/ 39) {
    				splitpane_changes.$$scope = { dirty, ctx };
    			}

    			splitpane.$set(splitpane_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(e_app_nav.$$.fragment, local);
    			transition_in(splitpane.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(e_app_nav.$$.fragment, local);
    			transition_out(splitpane.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(e_app_nav);
    			destroy_component(splitpane);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { fixed = false } = $$props;
    	let { fixedPos = 50 } = $$props;
    	let { orientation = "columns" } = $$props;

    	let filemenu = [{ lable: "File" }, { lable: "Edit" }, { lable: "Settings" }];
    	const writable_props = ["fixed", "fixedPos", "orientation"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("fixed" in $$props) $$invalidate(0, fixed = $$props.fixed);
    		if ("fixedPos" in $$props) $$invalidate(1, fixedPos = $$props.fixedPos);
    		if ("orientation" in $$props) $$invalidate(2, orientation = $$props.orientation);
    	};

    	$$self.$capture_state = () => {
    		return { fixed, fixedPos, orientation, filemenu };
    	};

    	$$self.$inject_state = $$props => {
    		if ("fixed" in $$props) $$invalidate(0, fixed = $$props.fixed);
    		if ("fixedPos" in $$props) $$invalidate(1, fixedPos = $$props.fixedPos);
    		if ("orientation" in $$props) $$invalidate(2, orientation = $$props.orientation);
    		if ("filemenu" in $$props) $$invalidate(3, filemenu = $$props.filemenu);
    	};

    	return [fixed, fixedPos, orientation, filemenu];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, { fixed: 0, fixedPos: 1, orientation: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get fixed() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixedPos() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixedPos(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get orientation() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set orientation(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: { }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
