
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
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
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.0' }, detail)));
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
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
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
        $capture_state() { }
        $inject_state() { }
    }

    /* app/svelte/dropzone.svelte generated by Svelte v3.29.0 */

    const file = "app/svelte/dropzone.svelte";

    function create_fragment(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Drop folders and individual SVGs here";
    			attr_dev(div, "class", "dropzone svelte-ixn65e");
    			add_location(div, file, 24, 0, 351);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "dragover", onDragOver, false, false, false),
    					listen_dev(
    						div,
    						"drop",
    						function () {
    							if (is_function(/*onDrop*/ ctx[0])) /*onDrop*/ ctx[0].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
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

    function onDragOver(event) {
    	event.preventDefault();
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Dropzone", slots, []);
    	let { onDrop } = $$props;
    	const writable_props = ["onDrop"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dropzone> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("onDrop" in $$props) $$invalidate(0, onDrop = $$props.onDrop);
    	};

    	$$self.$capture_state = () => ({ onDragOver, onDrop });

    	$$self.$inject_state = $$props => {
    		if ("onDrop" in $$props) $$invalidate(0, onDrop = $$props.onDrop);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onDrop];
    }

    class Dropzone extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { onDrop: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropzone",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onDrop*/ ctx[0] === undefined && !("onDrop" in props)) {
    			console.warn("<Dropzone> was created without expected prop 'onDrop'");
    		}
    	}

    	get onDrop() {
    		throw new Error("<Dropzone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDrop(value) {
    		throw new Error("<Dropzone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* app/svelte/loader.svelte generated by Svelte v3.29.0 */

    const file$1 = "app/svelte/loader.svelte";

    function create_fragment$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "loading...";
    			attr_dev(div, "class", "loader svelte-ffk72c");
    			add_location(div, file$1, 25, 0, 399);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Loader", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /**
     * @param {FileSystemFileEntry} entry
     * @returns {Promise<string | ArrayBuffer>}
     */
    function getText(entry) {
      return new Promise(function (resolve, reject) {
        entry.file(function (file) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
          reader.readAsText(file);
        }, reject);
      });
    }

    /**
     * @param {FileSystemFileEntry} entry
     * @returns {Promise<string>}
     */
    function getType(entry) {
      return new Promise(function (resolve, reject) {
        entry.file(function (file) {
          resolve(file.type);
        }, reject);
      });
    }

    /**
     * Sort by supplied key
     * To sort by directory use "type"
     *
     * @param {keyof IconRecord} key
     */
    function sortByRecordKey(key) {
      /**
       * @param {IconRecord} a 
       * @param {IconRecord} b 
       */
      function compareRecords(a, b) {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      }

      return compareRecords;
    }

    /**
     * Sort directories first
     *
     * @param {IconRecord} a
     * @param {IconRecord} b
     */
    function compareRecordTypes(a, b) {
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      return 0;
    }

    // Type guards
    //--------------------------------------------------------------------------------------------------
    /**
     * @param {FileSystemEntry} entry
     * @returns {entry is FileSystemDirectoryEntry}
     */
    function isDirectory(entry) {
      return entry.isDirectory;
    }

    /**
     * @param {FileSystemEntry} entry
     * @returns {entry is FileSystemFileEntry}
     */
    function isFile(entry) {
      return entry.isFile;
    }

    var utils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getText: getText,
        getType: getType,
        sortByRecordKey: sortByRecordKey,
        compareRecordTypes: compareRecordTypes,
        isDirectory: isDirectory,
        isFile: isFile
    });

    /* app/svelte/directory.svelte generated by Svelte v3.29.0 */
    const file$2 = "app/svelte/directory.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (60:0) {#if iconDir.contents.length > 0}
    function create_if_block(ctx) {
    	let ul1;
    	let li;
    	let t0_value = /*iconDir*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*sortedContents*/ ctx[1].length + "";
    	let t2;
    	let t3;
    	let ul0;
    	let current;
    	let each_value = /*sortedContents*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul1 = element("ul");
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = text(": ");
    			t2 = text(t2_value);
    			t3 = space();
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(li, "class", "dir__label svelte-twxnwx");
    			add_location(li, file$2, 61, 4, 1162);
    			attr_dev(ul0, "class", "dir__contents icongrid svelte-twxnwx");
    			add_location(ul0, file$2, 62, 4, 1234);
    			attr_dev(ul1, "class", "dir svelte-twxnwx");
    			add_location(ul1, file$2, 60, 2, 1141);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul1, anchor);
    			append_dev(ul1, li);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    			append_dev(ul1, t3);
    			append_dev(ul1, ul0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*iconDir*/ 1) && t0_value !== (t0_value = /*iconDir*/ ctx[0].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*sortedContents*/ 2) {
    				each_value = /*sortedContents*/ ctx[1];
    				validate_each_argument(each_value);
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
    						each_blocks[i].m(ul0, null);
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
    			if (detaching) detach_dev(ul1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(60:0) {#if iconDir.contents.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (64:6) {#each sortedContents as iconRecord}
    function create_each_block(ctx) {
    	let record;
    	let current;

    	record = new Record({
    			props: { iconRecord: /*iconRecord*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(record.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(record, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(record.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(record.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(record, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(64:6) {#each sortedContents as iconRecord}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*iconDir*/ ctx[0].contents.length > 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*iconDir*/ ctx[0].contents.length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*iconDir*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Directory", slots, []);
    	let { iconDir = { contents: [] } } = $$props;

    	function sortContents(contents) {
    		contents.sort(sortByRecordKey("name"));
    		contents.sort(sortByRecordKey("type"));
    		return contents;
    	}

    	let sortedContents = sortContents(iconDir.contents);
    	const writable_props = ["iconDir"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Directory> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("iconDir" in $$props) $$invalidate(0, iconDir = $$props.iconDir);
    	};

    	$$self.$capture_state = () => ({
    		utils,
    		Record,
    		iconDir,
    		sortContents,
    		sortedContents
    	});

    	$$self.$inject_state = $$props => {
    		if ("iconDir" in $$props) $$invalidate(0, iconDir = $$props.iconDir);
    		if ("sortedContents" in $$props) $$invalidate(1, sortedContents = $$props.sortedContents);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [iconDir, sortedContents];
    }

    class Directory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { iconDir: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Directory",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get iconDir() {
    		throw new Error("<Directory>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDir(value) {
    		throw new Error("<Directory>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* app/svelte/icon.svelte generated by Svelte v3.29.0 */

    const file$3 = "app/svelte/icon.svelte";

    function create_fragment$3(ctx) {
    	let li;
    	let raw_value = /*iconFile*/ ctx[0].contents + "";
    	let li_data_icon_key_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			attr_dev(li, "class", "icon");
    			attr_dev(li, "data-icon-key", li_data_icon_key_value = /*iconFile*/ ctx[0].name);
    			add_location(li, file$3, 5, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			li.innerHTML = raw_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*iconFile*/ 1 && raw_value !== (raw_value = /*iconFile*/ ctx[0].contents + "")) li.innerHTML = raw_value;
    			if (dirty & /*iconFile*/ 1 && li_data_icon_key_value !== (li_data_icon_key_value = /*iconFile*/ ctx[0].name)) {
    				attr_dev(li, "data-icon-key", li_data_icon_key_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Icon", slots, []);
    	let { iconFile } = $$props;
    	const writable_props = ["iconFile"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("iconFile" in $$props) $$invalidate(0, iconFile = $$props.iconFile);
    	};

    	$$self.$capture_state = () => ({ iconFile });

    	$$self.$inject_state = $$props => {
    		if ("iconFile" in $$props) $$invalidate(0, iconFile = $$props.iconFile);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [iconFile];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { iconFile: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*iconFile*/ ctx[0] === undefined && !("iconFile" in props)) {
    			console.warn("<Icon> was created without expected prop 'iconFile'");
    		}
    	}

    	get iconFile() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconFile(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* app/svelte/record.svelte generated by Svelte v3.29.0 */

    // (9:0) {#if iconRecord.type === 'directory'}
    function create_if_block_1(ctx) {
    	let directory;
    	let current;

    	directory = new Directory({
    			props: { iconDir: /*iconRecord*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(directory.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(directory, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const directory_changes = {};
    			if (dirty & /*iconRecord*/ 1) directory_changes.iconDir = /*iconRecord*/ ctx[0];
    			directory.$set(directory_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(directory.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(directory.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(directory, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(9:0) {#if iconRecord.type === 'directory'}",
    		ctx
    	});

    	return block;
    }

    // (13:0) {#if iconRecord.type === 'file'}
    function create_if_block$1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { iconFile: /*iconRecord*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*iconRecord*/ 1) icon_changes.iconFile = /*iconRecord*/ ctx[0];
    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(13:0) {#if iconRecord.type === 'file'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*iconRecord*/ ctx[0].type === "directory" && create_if_block_1(ctx);
    	let if_block1 = /*iconRecord*/ ctx[0].type === "file" && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*iconRecord*/ ctx[0].type === "directory") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*iconRecord*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*iconRecord*/ ctx[0].type === "file") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*iconRecord*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Record", slots, []);
    	let { iconRecord = {} } = $$props;
    	const writable_props = ["iconRecord"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Record> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("iconRecord" in $$props) $$invalidate(0, iconRecord = $$props.iconRecord);
    	};

    	$$self.$capture_state = () => ({ Directory, Icon, iconRecord });

    	$$self.$inject_state = $$props => {
    		if ("iconRecord" in $$props) $$invalidate(0, iconRecord = $$props.iconRecord);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [iconRecord];
    }

    class Record extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { iconRecord: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Record",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get iconRecord() {
    		throw new Error("<Record>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconRecord(value) {
    		throw new Error("<Record>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* app/svelte/gallery.svelte generated by Svelte v3.29.0 */
    const file$4 = "app/svelte/gallery.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (17:0) {#if showSpinner}
    function create_if_block_1$1(ctx) {
    	let loader;
    	let current;
    	loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(17:0) {#if showSpinner}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if iconRecords.length > 0}
    function create_if_block$2(ctx) {
    	let ul;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*iconRecords*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "gallery icongrid svelte-12qyn3a");
    			add_location(ul, file$4, 21, 2, 346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					ul,
    					"click",
    					function () {
    						if (is_function(/*onIconClick*/ ctx[2])) /*onIconClick*/ ctx[2].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*iconRecords*/ 1) {
    				each_value = /*iconRecords*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
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
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(21:0) {#if iconRecords.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (23:4) {#each iconRecords as iconRecord}
    function create_each_block$1(ctx) {
    	let record;
    	let current;

    	record = new Record({
    			props: { iconRecord: /*iconRecord*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(record.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(record, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const record_changes = {};
    			if (dirty & /*iconRecords*/ 1) record_changes.iconRecord = /*iconRecord*/ ctx[3];
    			record.$set(record_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(record.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(record.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(record, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(23:4) {#each iconRecords as iconRecord}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*showSpinner*/ ctx[1] && create_if_block_1$1(ctx);
    	let if_block1 = /*iconRecords*/ ctx[0].length > 0 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showSpinner*/ ctx[1]) {
    				if (if_block0) {
    					if (dirty & /*showSpinner*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*iconRecords*/ ctx[0].length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*iconRecords*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Gallery", slots, []);
    	let { iconRecords = [] } = $$props;
    	let { showSpinner = false } = $$props;
    	let { onIconClick } = $$props;
    	const writable_props = ["iconRecords", "showSpinner", "onIconClick"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("iconRecords" in $$props) $$invalidate(0, iconRecords = $$props.iconRecords);
    		if ("showSpinner" in $$props) $$invalidate(1, showSpinner = $$props.showSpinner);
    		if ("onIconClick" in $$props) $$invalidate(2, onIconClick = $$props.onIconClick);
    	};

    	$$self.$capture_state = () => ({
    		Loader,
    		Record,
    		iconRecords,
    		showSpinner,
    		onIconClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("iconRecords" in $$props) $$invalidate(0, iconRecords = $$props.iconRecords);
    		if ("showSpinner" in $$props) $$invalidate(1, showSpinner = $$props.showSpinner);
    		if ("onIconClick" in $$props) $$invalidate(2, onIconClick = $$props.onIconClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [iconRecords, showSpinner, onIconClick];
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			iconRecords: 0,
    			showSpinner: 1,
    			onIconClick: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onIconClick*/ ctx[2] === undefined && !("onIconClick" in props)) {
    			console.warn("<Gallery> was created without expected prop 'onIconClick'");
    		}
    	}

    	get iconRecords() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconRecords(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showSpinner() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showSpinner(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onIconClick() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onIconClick(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Turn the supplied FileSystemDirectoryEntry into an asynchronously iterable collection of entries
     *
     * @param { FileSystemDirectoryEntry } dirEntry
     */
    async function* asyncDirectoryIterator(dirEntry) {
      const reader = dirEntry.createReader();
      const getNextBatch = () =>
        new Promise((resolve, reject) => {
          reader.readEntries(resolve, reject);
        });

      /** @type {FileSystemEntry[]} */
      let entries;
      do {
        entries = await getNextBatch();
        for (const entry of entries) {
          yield entry;
        }
      } while (entries.length > 0);
    }

    /**
     * @param {FileSystemEntry} entry
     * @param {IconRecord[]} arr
     */
    async function scanEntries(entry, arr) {
      if (!entry) return arr;

      try {
        const { fullPath, name } = entry;

        if (isDirectory(entry)) {
          const contents = [];
          for await (const dirEntry of asyncDirectoryIterator(entry)) {
            await scanEntries(dirEntry, contents);
          }

          arr.push({ type: "directory", name, fullPath, contents });
        }

        if (isFile(entry)) {
          const fileType = await getType(entry);

          if (fileType === "image/svg+xml") {
            const contents = await getText(entry);
            arr.push({
              type: "file",
              name,
              fullPath,
              contents: String(contents),
            });
          }
        }
      } catch (error) {
        console.log(error);
      }

      return arr;
    }

    /**
     * @param {DataTransferItemList} items
     * @returns {Promise<IconRecord[]>}
     */
    async function scanDroppedItems(items) {
      // Async operations occur outside the scope of the event handler, so creating a new local record
      // of the dataTransfer items is required...
      /** @type {FileSystemEntry[]} */
      const files = items.map((item) => item.webkitGetAsEntry());

      let scannedEntries = [];
      for (let file of files) {
        await scanEntries(file, scannedEntries);
      }

      return scannedEntries;
    }

    /* app/svelte/app.svelte generated by Svelte v3.29.0 */

    const { console: console_1 } = globals;
    const file$5 = "app/svelte/app.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let dropzone;
    	let t;
    	let gallery;
    	let current;

    	dropzone = new Dropzone({
    			props: { onDrop: /*onDrop*/ ctx[2] },
    			$$inline: true
    		});

    	gallery = new Gallery({
    			props: {
    				iconRecords: /*iconRecords*/ ctx[0],
    				showSpinner: /*showSpinner*/ ctx[1],
    				onIconClick
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(dropzone.$$.fragment);
    			t = space();
    			create_component(gallery.$$.fragment);
    			attr_dev(main, "class", "app svelte-1sfd9kt");
    			add_location(main, file$5, 44, 0, 827);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(dropzone, main, null);
    			append_dev(main, t);
    			mount_component(gallery, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const gallery_changes = {};
    			if (dirty & /*iconRecords*/ 1) gallery_changes.iconRecords = /*iconRecords*/ ctx[0];
    			if (dirty & /*showSpinner*/ 2) gallery_changes.showSpinner = /*showSpinner*/ ctx[1];
    			gallery.$set(gallery_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropzone.$$.fragment, local);
    			transition_in(gallery.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropzone.$$.fragment, local);
    			transition_out(gallery.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(dropzone);
    			destroy_component(gallery);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function onIconClick(event) {
    	const item = event.target.closest("li");

    	if (item) {
    		console.log(item.dataset.iconKey);
    	}
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let iconRecords = [];
    	let showSpinner = false;

    	/**
     * @param {DragEvent} event
     */
    	async function onDrop(event) {
    		event.preventDefault();
    		$$invalidate(1, showSpinner = true);

    		try {
    			$$invalidate(0, iconRecords = await scanDroppedItems([...event.dataTransfer.items]));
    			$$invalidate(1, showSpinner = false);
    		} catch(error) {
    			console.log(error);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Dropzone,
    		Gallery,
    		scanDroppedItems,
    		iconRecords,
    		showSpinner,
    		onDrop,
    		onIconClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("iconRecords" in $$props) $$invalidate(0, iconRecords = $$props.iconRecords);
    		if ("showSpinner" in $$props) $$invalidate(1, showSpinner = $$props.showSpinner);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*iconRecords*/ 1) {
    			 console.log(`the count is ${iconRecords.length}`);
    		}
    	};

    	return [iconRecords, showSpinner, onDrop];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
