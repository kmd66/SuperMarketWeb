using DryIoc;
using System;
using IDryContainer = DryIoc.IContainer;

namespace Kama.Bonyad.Evaluation.WebApp.IOC
{
    public class Container : AppCore.IOC.IContainer
    {
        public Container(IDryContainer container)
        {
            _container = container;
        }

        private readonly IDryContainer _container;

        public void Dispose()
            => _container.Dispose();

        public bool IsRegistered(Type t)
            => _container.IsRegistered(t);

        public void RegisterInstance<T>(T instance)
            => _container.RegisterInstance<T>(instance);

        public void RegisterInstance<T>(string key, T instance)
            => _container.RegisterInstance<T>(serviceKey: key, instance: instance);

        public void RegisterType<TFrom, TTo>()
            where TTo : TFrom
            => _container.Register<TFrom, TTo>();

        public void RegisterType<TFrom, TTo>(string key)
            where TTo : TFrom
            => _container.Register<TFrom, TTo>(serviceKey: key);

        public void RegisterType(Type t)
            => _container.Register(serviceAndMayBeImplementationType: t);

        public void RegisterType(string key, Type t)
            => _container.Register(serviceKey: key, serviceAndMayBeImplementationType: t);

        public T Resolve<T>()
            => _container.Resolve<T>();

        public object Resolve(Type t)
            => _container.Resolve(t);

        public void RegisterType(Type from, Type to)
            => _container.Register(serviceType: from, implementationType: to);

        public void RegisterType(Type from, Type to, string key)
            => _container.Register(serviceType: from, implementationType: to, serviceKey: key);

        public T TryResolve<T>()
        {
            try
            {
                return _container.Resolve<T>();
            }
            catch (Exception ex)
            {
                return default(T);
            }
        }

        public object TryResolve(Type t)
        {
            try
            {
                return _container.Resolve(t);
            }
            catch
            {
                return null;
            }
        }

        public T Resolve<T>(string key)
            => _container.Resolve<T>(serviceKey: key);

        public T TryResolve<T>(string key)
        {
            try
            {
                return _container.Resolve<T>(serviceKey: key);
            }
            catch (Exception e)
            {
                return default(T);
            }
        }

        public object Resolve(Type t, string key)
            => _container.Resolve(t, serviceKey: key);

        public object TryResolve(Type t, string key)
        {
            try
            {
                return _container.Resolve(t, serviceKey: key);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public bool IsRegistered(Type t, string key)
            => _container.IsRegistered(t, key);
    }
}