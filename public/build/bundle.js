
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
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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

    /* src/editor/E_Button.svelte generated by Svelte v3.16.7 */

    const file = "src/editor/E_Button.svelte";

    function create_fragment(ctx) {
    	let button;
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*name*/ ctx[0]);
    			attr_dev(button, "class", "svelte-x19lqx");
    			add_location(button, file, 6, 0, 77);
    			dispose = listen_dev(button, "click", /*onclick*/ ctx[1], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t, /*name*/ ctx[0]);
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
    	let { name = "button" } = $$props;
    	let { onclick } = $$props;
    	const writable_props = ["name", "onclick"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<E_Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("onclick" in $$props) $$invalidate(1, onclick = $$props.onclick);
    	};

    	$$self.$capture_state = () => {
    		return { name, onclick };
    	};

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("onclick" in $$props) $$invalidate(1, onclick = $$props.onclick);
    	};

    	return [name, onclick];
    }

    class E_Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0, onclick: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "E_Button",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*onclick*/ ctx[1] === undefined && !("onclick" in props)) {
    			console.warn("<E_Button> was created without expected prop 'onclick'");
    		}
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

    /* src/editor/E_Pannel.svelte generated by Svelte v3.16.7 */

    const file$1 = "src/editor/E_Pannel.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let p;
    	let t0;
    	let t1;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(/*pannel_name*/ ctx[0]);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			add_location(p, file$1, 6, 4, 91);
    			attr_dev(div, "class", "n_pannel svelte-ltoro5");
    			add_location(div, file$1, 5, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*pannel_name*/ 1) set_data_dev(t0, /*pannel_name*/ ctx[0]);

    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 2) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[1], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
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
    	let { pannel_name = "New Pannel" } = $$props;
    	const writable_props = ["pannel_name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<E_Pannel> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("pannel_name" in $$props) $$invalidate(0, pannel_name = $$props.pannel_name);
    		if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { pannel_name };
    	};

    	$$self.$inject_state = $$props => {
    		if ("pannel_name" in $$props) $$invalidate(0, pannel_name = $$props.pannel_name);
    	};

    	return [pannel_name, $$scope, $$slots];
    }

    class E_Pannel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { pannel_name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "E_Pannel",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get pannel_name() {
    		throw new Error("<E_Pannel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pannel_name(value) {
    		throw new Error("<E_Pannel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/editor/E_Input_Ranger.svelte generated by Svelte v3.16.7 */

    const file$2 = "src/editor/E_Input_Ranger.svelte";

    function create_fragment$2(ctx) {
    	let input;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "number");
    			attr_dev(input, "min", /*val_min*/ ctx[0]);
    			attr_dev(input, "max", /*val_max*/ ctx[1]);
    			attr_dev(input, "class", "svelte-1w3vhrn");
    			add_location(input, file$2, 9, 0, 136);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*val_min*/ 1) {
    				attr_dev(input, "min", /*val_min*/ ctx[0]);
    			}

    			if (dirty & /*val_max*/ 2) {
    				attr_dev(input, "max", /*val_max*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { val_min = null } = $$props;
    	let { val_max = null } = $$props;
    	let { onclick } = $$props;
    	let { UpdateEvent } = $$props;
    	const writable_props = ["val_min", "val_max", "onclick", "UpdateEvent"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<E_Input_Ranger> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("val_min" in $$props) $$invalidate(0, val_min = $$props.val_min);
    		if ("val_max" in $$props) $$invalidate(1, val_max = $$props.val_max);
    		if ("onclick" in $$props) $$invalidate(2, onclick = $$props.onclick);
    		if ("UpdateEvent" in $$props) $$invalidate(3, UpdateEvent = $$props.UpdateEvent);
    	};

    	$$self.$capture_state = () => {
    		return { val_min, val_max, onclick, UpdateEvent };
    	};

    	$$self.$inject_state = $$props => {
    		if ("val_min" in $$props) $$invalidate(0, val_min = $$props.val_min);
    		if ("val_max" in $$props) $$invalidate(1, val_max = $$props.val_max);
    		if ("onclick" in $$props) $$invalidate(2, onclick = $$props.onclick);
    		if ("UpdateEvent" in $$props) $$invalidate(3, UpdateEvent = $$props.UpdateEvent);
    	};

    	return [val_min, val_max, onclick, UpdateEvent];
    }

    class E_Input_Ranger extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			val_min: 0,
    			val_max: 1,
    			onclick: 2,
    			UpdateEvent: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "E_Input_Ranger",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*onclick*/ ctx[2] === undefined && !("onclick" in props)) {
    			console.warn("<E_Input_Ranger> was created without expected prop 'onclick'");
    		}

    		if (/*UpdateEvent*/ ctx[3] === undefined && !("UpdateEvent" in props)) {
    			console.warn("<E_Input_Ranger> was created without expected prop 'UpdateEvent'");
    		}
    	}

    	get val_min() {
    		throw new Error("<E_Input_Ranger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set val_min(value) {
    		throw new Error("<E_Input_Ranger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get val_max() {
    		throw new Error("<E_Input_Ranger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set val_max(value) {
    		throw new Error("<E_Input_Ranger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onclick() {
    		throw new Error("<E_Input_Ranger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onclick(value) {
    		throw new Error("<E_Input_Ranger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get UpdateEvent() {
    		throw new Error("<E_Input_Ranger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set UpdateEvent(value) {
    		throw new Error("<E_Input_Ranger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/editor/E_App_Nav.svelte generated by Svelte v3.16.7 */
    const file$3 = "src/editor/E_App_Nav.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (13:1) {#each entrys as item}
    function create_each_block(ctx) {
    	let current;

    	const e_button = new E_Button({
    			props: { name: /*item*/ ctx[1].lable },
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
    		p: noop,
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
    		source: "(13:1) {#each entrys as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
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

    			attr_dev(div, "class", "app_nav red svelte-79rra4");
    			add_location(div, file$3, 11, 0, 156);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self) {
    	let entrys = [{ lable: "File" }, { lable: "Edit" }, { lable: "Settings" }];

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("entrys" in $$props) $$invalidate(0, entrys = $$props.entrys);
    	};

    	return [entrys];
    }

    class E_App_Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "E_App_Nav",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.7 */
    const file$4 = "src/App.svelte";

    // (15:1) <E_Pannel>
    function create_default_slot(ctx) {
    	let t0;
    	let t1;
    	let current;

    	const e_button0 = new E_Button({
    			props: {
    				name: "This is a nice button",
    				onclick: /*test*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const e_button1 = new E_Button({
    			props: { onclick: /*test*/ ctx[0] },
    			$$inline: true
    		});

    	const e_input_ranger = new E_Input_Ranger({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(e_button0.$$.fragment);
    			t0 = space();
    			create_component(e_button1.$$.fragment);
    			t1 = space();
    			create_component(e_input_ranger.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(e_button0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(e_button1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(e_input_ranger, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(e_button0.$$.fragment, local);
    			transition_in(e_button1.$$.fragment, local);
    			transition_in(e_input_ranger.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(e_button0.$$.fragment, local);
    			transition_out(e_button1.$$.fragment, local);
    			transition_out(e_input_ranger.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(e_button0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(e_button1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(e_input_ranger, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(15:1) <E_Pannel>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t0;
    	let div;
    	let h1;
    	let t2;
    	let current;
    	const e_app_nav = new E_App_Nav({ $$inline: true });

    	const e_pannel = new E_Pannel({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(e_app_nav.$$.fragment);
    			t0 = space();
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Hello, Amethyst!";
    			t2 = space();
    			create_component(e_pannel.$$.fragment);
    			add_location(h1, file$4, 13, 1, 327);
    			attr_dev(div, "class", "editor-frame testcolor svelte-yzr4cw");
    			add_location(div, file$4, 12, 0, 289);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(e_app_nav, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t2);
    			mount_component(e_pannel, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const e_pannel_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				e_pannel_changes.$$scope = { dirty, ctx };
    			}

    			e_pannel.$set(e_pannel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(e_app_nav.$$.fragment, local);
    			transition_in(e_pannel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(e_app_nav.$$.fragment, local);
    			transition_out(e_pannel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(e_app_nav, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(e_pannel);
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

    function instance$4($$self) {
    	const test = () => {
    		alert("test");
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [test];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: { }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
